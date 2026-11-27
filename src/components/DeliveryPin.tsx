import { useEffect, useId, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { deliveryPointUrl } from '../data/deliveryPoint'
import type { Pin } from '../data/deliveryPoint'
import './delivery-pin.css'

type Props = {
  pin: Pin | null
  onChange: (pin: Pin | null) => void
  include: boolean
  onInclude: (value: boolean) => void
  onUseAddress?: (address: string) => void
  hasAddress?: boolean
}

const cuenca: L.LatLngTuple = [-2.9, -79.01]
// Set only a public, origin-restricted Geoapify browser key at build time.
const addressKey = import.meta.env.VITE_GEOAPIFY_PUBLIC_KEY?.trim()

function PinGlyph({ target = false }: { target?: boolean }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {target ? <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.1" /><path d="M12 1v4m11 7h-4m-7 11v-4M1 12h4" /></> :
      <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.7" /></>}
  </svg>
}

function AddressSuggestion({ point, hasAddress, onUseAddress }: {
  point: Pin; hasAddress: boolean; onUseAddress: (address: string) => void
}) {
  const [suggestion, setSuggestion] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const request = useRef<AbortController | null>(null)
  useEffect(() => () => { request.current?.abort(); request.current = null }, [])

  async function lookup() {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 9000)
    setBusy(true)
    setMessage('')
    setSuggestion('')
    try {
      const params = new URLSearchParams({ lat: String(point.lat), lon: String(point.lng), lang: 'es', format: 'json', apiKey: addressKey })
      const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?${params}`, { signal: controller.signal, credentials: 'omit' })
      if (!response.ok) throw new Error('lookup')
      const { results } = await response.json()
      const place = results?.[0]
      if (request.current !== controller) return
      if (place?.street && typeof place.formatted === 'string' && place.formatted.trim()) {
        setSuggestion(place.formatted.trim().slice(0, 400))
      } else {
        setMessage('No encontramos una calle en este punto. Escribe tu dirección y referencia.')
      }
    } catch {
      if (request.current === controller) setMessage('La sugerencia no está disponible. Escribe tu dirección y referencia.')
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) setBusy(false)
    }
  }

  return <div className="pin-address">
    <p>Si buscas una dirección aproximada, compartirás este punto con <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a>.</p>
    {!suggestion && <button type="button" className="pin-action" disabled={busy} onClick={lookup}>{busy ? 'Buscando dirección…' : 'Buscar dirección aproximada'}</button>}
    {suggestion && <><p className="pin-suggestion" role="status">{suggestion}</p><button type="button" className="pin-action" onClick={() => {
      onUseAddress(suggestion)
      setMessage('Dirección añadida. Revisa el número y completa la referencia.')
      setSuggestion('')
    }}>{hasAddress ? 'Reemplazar mi dirección' : 'Usar esta dirección'}</button></>}
    {message && <p role="status">{message}</p>}
  </div>
}

function PinMap({ initial, gps, onMove, onManual }: {
  initial: Pin | null; gps: Pin | null; onMove: (point: Pin) => void; onManual: () => void
}) {
  const target = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tiles = useRef<L.TileLayer | null>(null)
  const positioning = useRef(false)
  const start = useRef(initial)
  const manual = useRef(onManual)
  const move = useRef(onMove)
  manual.current = onManual
  move.current = onMove
  const [tileError, setTileError] = useState(false)
  const captionId = useId()

  useEffect(() => {
    if (!target.current) return
    const map = L.map(target.current, { scrollWheelZoom: false, zoomAnimation: false, keyboard: true })
    const point = start.current
    map.setView(point ? [point.lat, point.lng] : cuenca, point ? 18 : 14)
    mapRef.current = map
    const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    tiles.current = layer
    layer.on('tileerror', () => setTileError(true))
    map.on('dragstart', () => manual.current())
    const reportPoint = (latLng: L.LatLng) => {
      const { lat, lng } = latLng.wrap()
      move.current({ lat, lng })
    }
    map.on('dragend', () => reportPoint(map.getCenter()))
    map.on('moveend', () => {
      // Keyboard panning, touch gestures and zooms all finish at the fixed pin.
      if (positioning.current) reportPoint(map.getCenter())
    })
    map.on('click', event => {
      manual.current()
      map.setView(event.latlng, map.getZoom(), { animate: false })
      reportPoint(event.latlng)
    })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => map.invalidateSize({ pan: false }))
    observer?.observe(target.current)
    return () => {
      observer?.disconnect()
      map.remove()
      mapRef.current = null
      tiles.current = null
    }
  }, [])

  useEffect(() => {
    if (gps) {
      positioning.current = false
      mapRef.current?.setView([gps.lat, gps.lng], 18, { animate: false })
    }
  }, [gps])

  function beginPlacement() {
    positioning.current = true
    manual.current()
  }

  return <>
    <p id={captionId} className="pin-help">Mueve el mapa hasta dejar el pin sobre la entrada, o toca un lugar. Con el teclado, usa las flechas y + o −.</p>
    <div className="pin-map-frame">
      <div ref={target} className="delivery-map" role="region" tabIndex={0} aria-label="Mapa para elegir el punto de entrega" aria-describedby={captionId}
        onPointerDownCapture={beginPlacement} onKeyDownCapture={event => {
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '=', '-'].includes(event.key)) beginPlacement()
        }} />
      <span className="pin-crosshair" aria-hidden="true"><PinGlyph /></span>
    </div>
    {tileError && <p className="pin-help" role="status">Algunas calles no cargaron. Puedes continuar con la dirección escrita. <button type="button" className="pin-text" onClick={() => { setTileError(false); tiles.current?.redraw() }}>Reintentar mapa</button></p>}
  </>
}

export function DeliveryPin({ pin, onChange, include, onInclude, onUseAddress, hasAddress = false }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Pin | null>(null)
  const [gps, setGps] = useState<Pin | null>(null)
  const [finding, setFinding] = useState(false)
  const [status, setStatus] = useState('')
  const request = useRef(0)
  const mapButton = useRef<HTMLButtonElement>(null)
  const editor = useRef<HTMLDivElement>(null)
  const savedRef = useRef<HTMLDivElement>(null)
  const editorId = useId()
  useEffect(() => () => { request.current++ }, [])

  function cancelLocation() {
    request.current++
    setFinding(false)
    setStatus('')
  }

  function startEditor() {
    if (!open) {
      setDraft(pin)
      setGps(null)
      setOpen(true)
      setStatus('')
    }
  }

  function locate() {
    startEditor()
    const token = ++request.current
    if (!navigator.geolocation) {
      setStatus('Tu navegador no ofrece ubicación. Elige el punto manualmente en el mapa.')
      return
    }
    setFinding(true)
    setStatus('Buscando tu ubicación…')
    const fail = (code?: number) => {
      if (token !== request.current) return
      setFinding(false)
      setStatus(code === 1 ? 'El navegador no dio permiso. Elige el punto manualmente en el mapa.' : code === 3
        ? 'La búsqueda tardó demasiado. Reintenta o elige el punto en el mapa.' : 'No pudimos ubicarte. Elige el punto manualmente en el mapa.')
    }
    try {
      navigator.geolocation.getCurrentPosition(position => {
        if (token !== request.current) return
        const { latitude: lat, longitude: lng, accuracy } = position.coords
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) { fail(); return }
        const point = { lat, lng }
        setGps(point)
        setDraft(point)
        setFinding(false)
        const precision = Number.isFinite(accuracy) ? `Precisión aproximada de ${Math.max(1, Math.ceil(accuracy))} m. ` : ''
        setStatus(`${precision}Ajusta el pin hasta la entrada de entrega.`)
      }, error => fail(error.code), { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 })
    } catch { fail() }
  }

  function finishEditor() {
    cancelLocation()
    setOpen(false)
    setGps(null)
  }

  return <div className="delivery-pin-field pin-picker">
    <h3>Punto de entrega <small>Opcional</small></h3>
    <p className="pin-help">Marca la entrada para que el repartidor sepa dónde encontrarte.</p>
    <div className="pin-actions">
      <button type="button" className="pin-action" disabled={finding} onClick={locate}><PinGlyph target />{finding ? 'Ubicando…' : 'Usar mi ubicación'}</button>
      {!open && <button ref={mapButton} type="button" className="pin-action" aria-expanded={false} aria-controls={editorId} onClick={() => { startEditor(); requestAnimationFrame(() => editor.current?.querySelector<HTMLElement>('.delivery-map')?.focus({ preventScroll: true })) }}><PinGlyph />{pin ? 'Ajustar en el mapa' : 'Elegir en el mapa'}</button>}
    </div>
    {status && <p className="pin-status" role="status">{status}</p>}
    {open && <div id={editorId} ref={editor} className="pin-editor">
      <PinMap initial={pin} gps={gps} onMove={setDraft} onManual={cancelLocation} />
      <div className="pin-actions">
        <button type="button" className="pin-action pin-confirm" disabled={!draft || finding} onClick={() => {
          if (!draft) return
          onChange(draft)
          onInclude(true)
          finishEditor()
          requestAnimationFrame(() => savedRef.current?.focus())
        }}>Incluir este punto en mi pedido</button>
        <button type="button" className="pin-text" onClick={() => { finishEditor(); requestAnimationFrame(() => mapButton.current?.focus()) }}>Cancelar</button>
      </div>
    </div>}
    {pin && !open && <div className="pin-saved">
      <div ref={savedRef} tabIndex={-1} className="pin-saved-title"><PinGlyph /><strong>Punto elegido</strong></div>
      <a href={deliveryPointUrl(pin)} target="_blank" rel="noreferrer">Ver punto en Google Maps ↗</a>
      <label className="option-choice"><input type="checkbox" checked={include} onChange={event => onInclude(event.target.checked)} />Incluir el enlace del punto en el resumen del pedido</label>
      <button type="button" className="pin-text" onClick={() => { onChange(null); onInclude(false); requestAnimationFrame(() => mapButton.current?.focus()) }}>Quitar punto</button>
      {addressKey && onUseAddress && <AddressSuggestion key={`${pin.lat},${pin.lng}`} point={pin} hasAddress={hasAddress} onUseAddress={onUseAddress} />}
    </div>}
  </div>
}
