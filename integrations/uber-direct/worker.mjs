// Run as a Web Standard fetch handler, with configuration supplied by the host.
const sessions = new WeakMap()
const bodyLimit = 4096
const tokenUrl = 'https://auth.uber.com/oauth/v2/token'

class InputError extends Error {
  constructor(status) { super('Invalid request'); this.status = status }
}

function coordinate(value, max) {
  return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= max
}

function pickupFor(env) {
  if (!env.UBER_PICKUP_STREET?.trim() || !env.UBER_PICKUP_LAT?.trim() || !env.UBER_PICKUP_LNG?.trim()) return null
  const lat = Number(env.UBER_PICKUP_LAT)
  const lng = Number(env.UBER_PICKUP_LNG)
  if (!coordinate(lat, 90) || !coordinate(lng, 180)) return null
  return { address: structuredAddress(env.UBER_PICKUP_STREET.trim()), lat, lng }
}

function structuredAddress(street) {
  return JSON.stringify({ street_address: [street], city: 'Cuenca', state: 'Azuay', country: 'EC' })
}

async function readDestination(request) {
  if (Number(request.headers.get('content-length')) > bodyLimit) throw new InputError(413)
  const reader = request.body?.getReader()
  if (!reader) throw new InputError(400)
  const bytes = new Uint8Array(bodyLimit)
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value.length > bodyLimit - size) {
      await reader.cancel()
      throw new InputError(413)
    }
    bytes.set(value, size)
    size += value.length
  }
  let data
  try { data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, size))) }
  catch { throw new InputError(400) }
  if (!data || typeof data !== 'object' || Object.keys(data).some(key => !['address', 'pin'].includes(key))) throw new InputError(400)
  const address = data.address
  if (typeof address !== 'string' || address.trim().length < 4 || address.length > 400) throw new InputError(400)
  const pin = data.pin
  if (pin != null && (!coordinate(pin.lat, 90) || !coordinate(pin.lng, 180) || Object.keys(pin).some(k => !['lat', 'lng'].includes(k)))) throw new InputError(400)
  return { address: structuredAddress(address.trim()), pin }
}

async function newToken(env, http) {
  const response = await http(tokenUrl, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5_000),
    body: new URLSearchParams({
      client_id: env.UBER_CLIENT_ID, client_secret: env.UBER_CLIENT_SECRET,
      grant_type: 'client_credentials', scope: 'eats.deliveries',
    }),
  })
  if (!response.ok) throw new Error('OAuth unavailable')
  const { access_token: value, expires_in: ttl } = await response.json()
  if (typeof value !== 'string' || !value || !Number.isFinite(ttl) || ttl <= 0) throw new Error('Invalid token')
  return { value, validUntil: Date.now() + ttl * 1000 - Math.min(60_000, ttl * 100) }
}

async function accessToken(env, http) {
  const existing = sessions.get(env)
  if (existing) {
    const token = await existing
    if (token.validUntil > Date.now()) return token
    // Another concurrent caller may already have started refreshing this token.
    if (sessions.get(env) !== existing) return accessToken(env, http)
  }
  const pending = newToken(env, http)
  sessions.set(env, pending)
  try { return await pending }
  catch (error) { if (sessions.get(env) === pending) sessions.delete(env); throw error }
}

async function requestQuote(env, http, body) {
  const url = `https://api.uber.com/v1/customers/${encodeURIComponent(env.UBER_CUSTOMER_ID)}/delivery_quotes`
  for (let attempt = 0; attempt < 2; attempt++) {
    const token = await accessToken(env, http)
    const response = await http(url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(5_000),
      headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.status !== 401 || attempt === 1) return response
    const cached = sessions.get(env)
    if (cached && await cached === token && sessions.get(env) === cached) sessions.delete(env)
  }
}

export async function handleQuote(request, env, http = fetch) {
  const headers = { 'Cache-Control': 'no-store', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff' }
  const reply = (status, data) => Response.json(data, { status, headers })
  const url = new URL(request.url)
  if (url.pathname !== '/quote' || url.search) return reply(404, { error: 'not_found' })
  const origin = request.headers.get('origin')
  if (!origin || origin === 'null' || origin !== env.ALLOWED_ORIGIN) return reply(403, { error: 'origin' })
  headers['Access-Control-Allow-Origin'] = origin
  if (request.method === 'OPTIONS') {
    headers['Access-Control-Allow-Methods'] = 'POST'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return new Response(null, { status: 204, headers })
  }
  if (request.method !== 'POST') return reply(405, { error: 'method' })
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply(415, { error: 'content_type' })
  const pickup = pickupFor(env)
  if (!pickup || !env.UBER_CLIENT_ID || !env.UBER_CUSTOMER_ID || !env.UBER_CLIENT_SECRET) return reply(503, { error: 'unavailable' })

  try {
    const destination = await readDestination(request)
    const response = await requestQuote(env, http, {
      pickup_address: pickup.address, pickup_latitude: pickup.lat, pickup_longitude: pickup.lng,
      dropoff_address: destination.address,
      ...(destination.pin && { dropoff_latitude: destination.pin.lat, dropoff_longitude: destination.pin.lng }),
    })
    if ([400, 422].includes(response.status)) return reply(422, { error: 'quote_unavailable' })
    if (response.status === 429) return reply(429, { error: 'try_later' })
    if (!response.ok) return reply(502, { error: 'provider_unavailable' })
    const data = await response.json()
    const currency = String(data.currency_type ?? data.currency ?? '').toUpperCase()
    if (!Number.isSafeInteger(data.fee) || data.fee < 0 || !/^[A-Z]{3}$/.test(currency) || !(Date.parse(data.expires) > Date.now())) {
      return reply(502, { error: 'quote_unavailable' })
    }
    return reply(200, {
      fee: data.fee, currency, expiresAt: data.expires,
      dropoffEta: typeof data.dropoff_eta === 'string' && Number.isFinite(Date.parse(data.dropoff_eta)) ? data.dropoff_eta : null,
    })
  } catch (error) {
    return error instanceof InputError ? reply(error.status, { error: 'invalid_input' }) : reply(502, { error: 'provider_unavailable' })
  }
}

export default { fetch: (request, env) => handleQuote(request, env) }
