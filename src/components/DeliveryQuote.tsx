import { useEffect, useRef, useState } from 'react'
import type { Pin } from '../data/deliveryPoint'
import { currentFeeQuote, deliveryRouteKey, quoteMoney, readFeeQuote } from '../data/deliveryQuote'
import type { FeeQuote } from '../data/deliveryQuote'
import './DeliveryQuote.css'

export function useCurrentDeliveryQuote(quote: FeeQuote | null, address: string, pin: Pin | null, delivery: boolean) {
  const [, refresh] = useState(0)
  useEffect(() => {
    if (!quote) return
    const ms = Date.parse(quote.expiresAt) - Date.now()
    if (ms <= 0) return
    const update = () => refresh(value => value + 1)
    const timer = window.setTimeout(update, Math.min(ms + 1, 2_147_483_647))
    document.addEventListener('visibilitychange', update)
    return () => { window.clearTimeout(timer); document.removeEventListener('visibilitychange', update) }
  }, [quote])
  return currentFeeQuote(quote, address, pin, delivery)
}

function quoteEndpoint() {
  const configured = import.meta.env.VITE_UBER_QUOTE_URL?.trim()
  if (!configured) return null
  try {
    const endpoint = new URL(configured, window.location.href)
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname)
    if (endpoint.username || endpoint.password || endpoint.search || endpoint.hash) return null
    return endpoint.protocol === 'https:' || (local && endpoint.protocol === 'http:') ? endpoint.href : null
  } catch { return null }
}

type Props = { address: string; pin: Pin | null; quote: FeeQuote | null; onChange: (value: FeeQuote | null) => void }

export function DeliveryQuote({ address, pin, quote, onChange }: Props) {
  const endpoint = quoteEndpoint()
  const key = deliveryRouteKey(address, pin)
  const valid = useCurrentDeliveryQuote(quote, address, pin, true)
  const active = useRef<AbortController | null>(null)
  const [request, setRequest] = useState({ key: '', busy: false, message: '' })
  useEffect(() => () => { active.current?.abort(); active.current = null }, [key])

  if (!endpoint) return null
  const busy = request.key === key && request.busy && Boolean(active.current)
  const message = request.key === key ? request.message : ''
  const expired = quote && quote.routeKey === key && !valid

  async function getQuote() {
    if (!endpoint || busy || address.trim().length < 4) return
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setRequest({ key, busy: true, message: '' })
    onChange(null)
    const timer = window.setTimeout(() => controller.abort(), 20_000)
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
        cache: 'no-store', referrerPolicy: 'strict-origin', redirect: 'error',
        body: JSON.stringify({ address: address.trim(), pin }), signal: controller.signal,
      })
      if (active.current !== controller) return
      if (!response.ok) {
        const message = response.status === 422 ? 'Uber Direct no pudo cotizar esta ruta. Revisa la dirección o consulta el envío con Ajitate.'
          : 'No se pudo obtener la tarifa. Puedes continuar y consultarla con Ajitate.'
        setRequest({ key, busy: false, message })
        return
      }
      const received = readFeeQuote(await response.json(), key)
      if (active.current !== controller) return
      if (!received) throw new Error('invalid_quote')
      onChange(received)
      setRequest({ key, busy: false, message: '' })
    } catch {
      if (active.current === controller) setRequest({ key, busy: false, message: 'No se pudo obtener la tarifa. Puedes volver a intentar.' })
    } finally {
      window.clearTimeout(timer)
      if (active.current === controller) active.current = null
    }
  }

  return <div className="delivery-quote-field">
    <h3>Tarifa de entrega</h3>
    <p className="order-hint">Al cotizar, compartes {pin ? 'tu dirección y el punto elegido' : 'tu dirección'} con Uber Direct para consultar el precio del envío.</p>
    <button type="button" className="glass-action" disabled={busy || address.trim().length < 4} onClick={getQuote}>
      {busy ? 'Consultando tarifa…' : 'Cotizar con Uber Direct'}
    </button>
    {address.trim().length < 4 && <p className="order-hint">Escribe tu dirección para consultar la tarifa.</p>}
    <div role="status">
      {valid && <p>Envío estimado: <strong>{quoteMoney(valid)}</strong>. Tarifa válida hasta las {new Intl.DateTimeFormat('es-EC', { timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(valid.expiresAt))} (Cuenca). Ajitate confirmará el envío antes de solicitar un repartidor.</p>}
      {expired && !busy && <p>La cotización venció. Vuelve a consultar la tarifa.</p>}
      {message && <p>{message}</p>}
    </div>
  </div>
}
