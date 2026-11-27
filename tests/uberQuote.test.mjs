import test from 'node:test'
import assert from 'node:assert/strict'
import { handleQuote } from '../integrations/uber-direct/worker.mjs'

const origin = 'https://restaurant.example'
const destination = { address: 'Calle de prueba 23', pin: { lat: -2.9, lng: -79 } }
const env = () => ({
  ALLOWED_ORIGIN: origin, UBER_CLIENT_ID: 'client', UBER_CLIENT_SECRET: 'fixture', UBER_CUSTOMER_ID: 'merchant',
  UBER_PICKUP_STREET: 'Local de prueba', UBER_PICKUP_LAT: '-2.92', UBER_PICKUP_LNG: '-79.01',
})
function request(data = destination, options = {}) {
  return new Request('https://worker.example/quote', {
    method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data), ...options,
  })
}
const quote = () => ({ fee: 390, currency: 'usd', expires: new Date(Date.now() + 900000).toISOString(), dropoff_eta: null })
const auth = () => Response.json({ access_token: 'fixture-token', expires_in: 3600 })
const unused = () => { throw new Error('unexpected upstream request') }

test('concurrent requests reuse OAuth and only POST quotes from the configured pickup', async () => {
  const config = env()
  const result = quote()
  let tokens = 0
  let quotes = 0
  const provider = async (url, init) => {
    assert.equal(init.method, 'POST')
    if (url === 'https://auth.uber.com/oauth/v2/token') {
      assert.equal(init.body.get('scope'), 'eats.deliveries')
      tokens++
      return auth()
    }
    assert.equal(url, 'https://api.uber.com/v1/customers/merchant/delivery_quotes')
    assert.equal(init.headers.Authorization, 'Bearer fixture-token')
    const body = JSON.parse(init.body)
    assert.equal(JSON.parse(body.pickup_address).street_address[0], config.UBER_PICKUP_STREET)
    assert.equal(body.pickup_latitude, -2.92)
    assert.equal(JSON.parse(body.dropoff_address).street_address[0], destination.address)
    assert.equal(body.dropoff_latitude, destination.pin.lat)
    quotes++
    return Response.json({ ...result, id: 'not-returned', pickup_address: 'not-returned' })
  }
  const [first, second] = await Promise.all([handleQuote(request(), config, provider), handleQuote(request(), config, provider)])
  assert.equal(tokens, 1)
  assert.equal(quotes, 2)
  assert.equal(first.headers.get('cache-control'), 'no-store')
  assert.equal(second.headers.get('access-control-allow-origin'), origin)
  assert.deepEqual(await first.json(), { fee: 390, currency: 'USD', expiresAt: result.expires, dropoffEta: null })
})

test('rejects unauthorized origin, oversized payload, invalid pin and client-supplied pickup', async () => {
  const config = env()
  assert.equal((await handleQuote(request(destination, { headers: { origin: 'https://other.example' } }), config, unused)).status, 403)
  assert.equal((await handleQuote(request({ address: 'x'.repeat(5000) }), config, unused)).status, 413)
  assert.equal((await handleQuote(request({ ...destination, pin: { lat: 1000, lng: 0 } }), config, unused)).status, 400)
  assert.equal((await handleQuote(request({ ...destination, pickup_address: 'other pickup' }), config, unused)).status, 400)
  assert.equal((await handleQuote(request(), { ...config, UBER_PICKUP_LAT: '' }, unused)).status, 503)
  const preflight = new Request('https://worker.example/quote', { method: 'OPTIONS', headers: { origin } })
  assert.equal((await handleQuote(preflight, config, unused)).status, 204)
})

test('failed authentication can recover and unquoteable routes stay distinct from service errors', async () => {
  const config = env()
  assert.equal((await handleQuote(request(), config, () => new Response(null, { status: 401 }))).status, 502)
  const denied = (url) => url.includes('/oauth/') ? auth() : new Response(null, { status: 422 })
  assert.equal((await handleQuote(request(), config, denied)).status, 422)
  const expired = () => Response.json({ ...quote(), expires: new Date(0).toISOString() })
  assert.equal((await handleQuote(request(), config, expired)).status, 502)
})

test('a rejected bearer token is refreshed once and never used for dispatch', async () => {
  let tokens = 0
  let quotes = 0
  const provider = async url => {
    if (url === 'https://auth.uber.com/oauth/v2/token') {
      tokens++
      return Response.json({ access_token: `token${tokens}`, expires_in: 3600 })
    }
    assert.ok(url.endsWith('/delivery_quotes'))
    quotes++
    return quotes === 1 ? new Response(null, { status: 401 }) : Response.json(quote())
  }
  const response = await handleQuote(request({ address: 'Calle sin pin' }), env(), provider)
  assert.equal(response.status, 200)
  assert.equal(tokens, 2)
  assert.equal(quotes, 2)
})
