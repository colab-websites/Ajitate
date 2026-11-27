import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MENU, lineKey, money, subtotal, unitPrice } from '../data/menu'
import type { CartLine } from '../data/menu'
import { matchesMenuSearch } from '../data/menuSearch'
import { addCartLine, CART_KEY, MAX_QUANTITY, restoreCart } from '../data/orderCart'
import { formatPhone, isValidPhone } from '../data/phone'
import { deliveryPointUrl } from '../data/deliveryPoint'
import type { Pin } from '../data/deliveryPoint'
import { MenuPhoto } from './MenuPhoto'
import { CheckoutIcon, FulfillmentChoices, PaymentChoices } from './CheckoutChoices'
import { paymentRequest, whatsAppDraft } from '../data/checkout'
import type { Fulfillment, PaymentMethod } from '../data/checkout'
import { DeliveryQuote, useCurrentDeliveryQuote } from './DeliveryQuote'
import { currentFeeQuote, quoteMoney } from '../data/deliveryQuote'
import type { FeeQuote } from '../data/deliveryQuote'
import './order-drawer.css'

const DeliveryPin = lazy(() => import('./DeliveryPin').then(module => ({ default: module.DeliveryPin })))
const categories = ['Todo', ...new Set(MENU.map(item => item.category))]
const products = new Map(MENU.map(item => [item.id, item]))
const comboSides = [
  { value: '', label: 'Solo el plato' },
  { value: 'Chilli nachos', label: 'Combo con chilli nachos' },
  { value: 'Papas', label: 'Combo con papas' },
]
type Step = 'browse' | 'item' | 'cart' | 'details' | 'summary'
type Request = { serial: number; id: string; quick?: boolean }

function loadCart() {
  try {
    return restoreCart(sessionStorage.getItem(CART_KEY))
  } catch {
    return []
  }
}

export function OrderDrawer({ request }: { request: Request }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const lastRequest = useRef(0)
  const summaryText = useRef<HTMLTextAreaElement>(null)
  const draftPreview = useRef<HTMLDetailsElement>(null)
  const addressInput = useRef<HTMLTextAreaElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('browse')
  const [selected, setSelected] = useState(MENU[0].id)
  const [side, setSide] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState<CartLine[]>(loadCart)
  const [category, setCategory] = useState('Todo')
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<Fulfillment>('delivery')
  const [payment, setPayment] = useState<PaymentMethod | ''>('')
  const [quote, setQuote] = useState<FeeQuote | null>(null)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [pin, setPin] = useState<Pin | null>(null)
  const [includePin, setIncludePin] = useState(false)
  const [napkins, setNapkins] = useState(false)
  const [straws, setStraws] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notice, setNotice] = useState('')

  const currentQuote = useCurrentDeliveryQuote(quote, address, pin, method === 'delivery')
  const item = products.get(selected)!
  const plainQuantities = new Map(cart.filter(line => !line.side).map(line => [line.id, line.quantity]))
  const configured = { id: selected, side: item.combo ? side : '', quantity }
  const existing = cart.find(line => lineKey(line) === lineKey(configured))
  const remaining = MAX_QUANTITY - (existing?.quantity ?? 0)
  const addQuantity = Math.min(remaining, quantity)
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)
  const total = subtotal(cart)
  const hasBeverage = cart.some(line => !!line.side ||
    ['Bebidas', 'Cervezas', 'Cocteles'].includes(products.get(line.id)!.category))
  const showFloatingCart = count > 0 && (step === 'browse' || step === 'item')
  const visible = MENU.filter(product => search.trim()
    ? matchesMenuSearch(product, search)
    : category === 'Todo' || product.category === category)

  useEffect(() => {
    try {
      if (cart.length) sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
      else sessionStorage.removeItem(CART_KEY)
    } catch {
      // The current order remains usable when browser storage is unavailable.
    }
  }, [cart])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3300)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!hasBeverage) setStraws(false)
  }, [hasBeverage])

  useLayoutEffect(() => {
    if (!open) return
    if (body.current) body.current.scrollTop = 0
    title.current?.focus({ preventScroll: true })
  }, [open, step])

  function go(next: Step) {
    setNotice('')
    setStep(next)
  }

  function show() {
    if (!dialog.current || dialog.current.open) return
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.current.showModal()
    setOpen(true)
  }

  function afterClose() {
    setOpen(false)
    setNotice('')
    if (opener.current?.isConnected && opener.current !== document.body && opener.current.getClientRects().length) {
      opener.current.focus({ preventScroll: true })
    } else {
      const fallback = document.querySelector<HTMLElement>('.cart-floating') ?? document.querySelector<HTMLElement>('.masthead-order, #menu button')
      fallback?.focus({ preventScroll: true })
    }
  }

  function choose(id: string) {
    setSelected(id)
    setSide('')
    setQuantity(1)
    go('item')
  }

  function quickAdd(id: string) {
    const product = products.get(id)
    if (!product) return
    const current = plainQuantities.get(id) ?? 0
    if (current >= MAX_QUANTITY) {
      setNotice(`Ya tienes ${MAX_QUANTITY} unidades de ${product.name} en el pedido.`)
      return
    }
    setCart(previous => addCartLine(previous, { id, side: '', quantity: 1 }))
    setNotice(`${product.name} agregado · ${current + 1} en tu pedido`)
  }

  useEffect(() => {
    if (!request.serial || lastRequest.current === request.serial) return
    lastRequest.current = request.serial
    if (request.id && !products.has(request.id)) return
    if (request.quick && request.id) {
      quickAdd(request.id)
      return
    }
    if (request.id) choose(request.id)
    else go(count ? 'cart' : 'browse')
    setCopied(false)
    show()
  }, [request])

  function add() {
    if (addQuantity < 1) return
    setCart(previous => addCartLine(previous, { ...configured, quantity: addQuantity }))
    go('cart')
  }

  function change(key: string, delta: number) {
    setCart(previous => previous.map(line => lineKey(line) === key
      ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + delta) }
      : line).filter(line => line.quantity > 0))
  }

  function removeLine(key: string) {
    setCart(previous => previous.filter(line => lineKey(line) !== key))
    title.current?.focus({ preventScroll: true })
  }

  function resetSearch() {
    setSearch('')
    setCategory('Todo')
    searchInput.current?.focus()
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const field = form.elements.namedItem('phone') as HTMLInputElement
    const addressField = form.elements.namedItem('address') as HTMLTextAreaElement | null
    field.setCustomValidity(isValidPhone(phone) ? '' : 'Escribe un teléfono válido con 7 a 15 dígitos.')
    if (addressField) addressField.setCustomValidity(address.trim() ? '' : 'Escribe tu dirección y una referencia.')
    if (!form.reportValidity()) return
    setCopied(false)
    go('summary')
  }

  function updateAddress(value: string) {
    setAddress(value)
    setQuote(null)
    addressInput.current?.setCustomValidity('')
  }

  function feeText(active: FeeQuote | null) {
    return active ? quoteMoney(active) : 'Por confirmar'
  }

  function totalText(active: FeeQuote | null) {
    if (method === 'pickup') return money(total)
    return active?.currency === 'USD' ? money(total + active.fee) : 'Por confirmar'
  }

  function buildSummary(active: FeeQuote | null) {
    return [
      'Hola Ajitate, quisiera confirmar este pedido:',
      ...cart.map(line => {
        const combo = line.side ? ` · Combo: ${line.side} + bebida` : ''
        return `${line.quantity} × ${products.get(line.id)!.name}${combo}: ${money(unitPrice(line) * line.quantity)}`
      }),
      `Subtotal de productos: ${money(total)}`,
      method === 'delivery' ? `Entrega a domicilio: ${address.trim()}` : 'Retiro en el local (por confirmar)',
      ...(method === 'delivery' && pin && includePin ? [`Punto de entrega: ${deliveryPointUrl(pin)}`] : []),
      `Preferencia de pago: ${payment ? payment + ' (por confirmar)' : 'Por definir'}`,
      'Estado del pago: pendiente.',
      ...(method === 'delivery' ? [`Envío: ${feeText(active)}`] : []),
      `Total estimado: ${totalText(active)}. Ajitate confirmará el importe final.`,
      `Nombre: ${name.trim()}`, `Teléfono: ${formatPhone(phone)}`,
      `Servilletas: ${napkins ? 'Sí' : 'No'}${hasBeverage ? ` · Sorbetes: ${straws ? 'Sí' : 'No'}` : ''} (sin recargo)`,
      ...(notes.trim() ? [`Notas: ${notes.trim()}`] : []),
      [
        'Por favor confirmar disponibilidad',
        ...(cart.some(line => line.side) ? ['opciones de bebida del combo'] : []),
        ...(method === 'delivery' && !active ? ['costo de entrega'] : []),
        payment ? 'total final.' : 'total final y forma de pago.',
      ].join(', '),
      ...(payment ? [paymentRequest(payment, method)] : []),
    ].join('\n')
  }

  const summary = buildSummary(currentQuote)
  const latestSummary = () => buildSummary(currentFeeQuote(quote, address, pin, method === 'delivery'))
  const handoff = whatsAppDraft(summary, import.meta.env.VITE_AJITATE_WHATSAPP_NUMBER)

  async function copy() {
    try {
      await navigator.clipboard.writeText(latestSummary())
      setCopied(true)
    } catch {
      if (draftPreview.current) draftPreview.current.open = true
      if (summaryText.current) summaryText.current.value = latestSummary()
      summaryText.current?.focus()
      summaryText.current?.select()
      setNotice('El resumen está seleccionado. Usa la opción Copiar de tu dispositivo.')
    }
  }

  const heading = {
    browse: '¿QUÉ SE TE ANTOJA?', item: item.name, cart: 'TU PEDIDO',
    details: 'PERSONALIZA TU ENTREGA', summary: 'REVISA TU PEDIDO',
  }[step]

  return <>
    {notice && !open && <p className="order-toast" role="status">{notice}</p>}
    {count > 0 && <button className="cart-floating liquid-panel" onClick={() => { go('cart'); show() }}>
      Ver carrito <b>{count}</b> · {money(total)}
    </button>}
    <dialog ref={dialog} className="order-drawer" data-step={step} aria-labelledby="drawer-title" onClose={afterClose}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {open && <div className="drawer-shell">
        <header className="drawer-header">
          <div><p className="section-kicker">PEDIDOS AJITATE</p><h2 ref={title} tabIndex={-1} id="drawer-title">{heading}</h2></div>
          <button className="drawer-close" aria-label="Cerrar pedido" onClick={() => dialog.current?.close()}>×</button>
        </header>
        <nav className="drawer-steps" aria-label="Pasos del pedido">
          <button onClick={() => go('browse')} aria-current={step === 'browse' || step === 'item' ? 'step' : undefined}>1 · Menú</button>
          <button disabled={!count} onClick={() => go('cart')} aria-current={step === 'cart' ? 'step' : undefined}>2 · Pedido ({count})</button>
          <span aria-current={step === 'details' || step === 'summary' ? 'step' : undefined}>3 · Revisar</span>
        </nav>
        <div ref={body} className={`drawer-body ${showFloatingCart ? 'has-floating-cart' : ''}`}>
          {notice && (step === 'browse' || step === 'summary') && <p className="order-notice" role="status">{notice}</p>}
          {step === 'browse' && <>
            <input ref={searchInput} className="order-input" type="search" aria-label="Buscar producto para pedir" placeholder="Busca un plato o ingrediente…" value={search}
              onChange={event => { setSearch(event.target.value); setCategory('Todo') }} />
            <div className="drawer-categories" role="group" aria-label="Filtrar productos">
              {categories.map(option => <button key={option} aria-pressed={category === option}
                onClick={() => { setCategory(option); setSearch('') }}>{option}</button>)}
            </div>
            <p className="drawer-results" role="status">{visible.length} {visible.length === 1 ? 'opción' : 'opciones'}</p>
            <div className="drawer-products">
              {visible.map(product => {
                const inCart = plainQuantities.get(product.id) ?? 0
                return <article key={product.id} className="drawer-product">
                  <button className="drawer-product-info" onClick={() => choose(product.id)} aria-label={`Ver ${product.name} · ${money(product.price)}`}>
                    <MenuPhoto item={product} compact /><small>{product.category}</small>
                    <strong>{product.name}</strong><p>{product.description}</p><span>{money(product.price)}</span>
                  </button>
                  <div className={inCart > 0 ? 'quantity-control browse-quantity' : 'drawer-add-control'}>
                    {inCart > 0 && <><button aria-label={`Reducir ${product.name}`} onClick={event => {
                      if (inCart === 1) event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('[data-increase]')?.focus()
                      change(lineKey({ id: product.id, side: '' }), -1)
                    }}>−</button><output aria-live="polite">{inCart}</output></>}
                    <button data-increase className={inCart ? undefined : 'quick-add'} aria-label={`Agregar ${product.name}`}
                      disabled={inCart >= MAX_QUANTITY} onClick={() => quickAdd(product.id)}>+</button>
                  </div>
                </article>
              })}
            </div>
            {visible.length === 0 && <div className="empty-cart"><h3>No encontramos ese producto.</h3>
              <button className="glass-action" onClick={resetSearch}>Ver todo el menú</button></div>}
          </>}
          {step === 'item' && <div className="item-options">
            <MenuPhoto item={item} /><span className="food-category">{item.category}</span>
            <p>{item.description}</p><strong className="item-price">{money(item.price)}</strong>
            {item.combo && <fieldset><legend>¿Lo hacemos combo? + {money(199)}</legend>
              <p className="order-hint">Incluye chilli nachos o papas y bebida. Las opciones de bebida se confirman con el restaurante.</p>
              {comboSides.map(option => <label key={option.value} className="option-choice">
                <input type="radio" name="combo" checked={side === option.value} onChange={() => { setSide(option.value); setQuantity(Math.max(1, addQuantity)) }} />{option.label}
              </label>)}
            </fieldset>}
            <div className="quantity-row"><span>Cantidad</span><div className="quantity-control">
              <button aria-label="Reducir cantidad" disabled={addQuantity <= 1} onClick={() => setQuantity(addQuantity - 1)}>−</button>
              <output aria-live="polite">{addQuantity}</output>
              <button aria-label="Aumentar cantidad" disabled={addQuantity >= remaining} onClick={() => setQuantity(addQuantity + 1)}>+</button>
            </div></div>
            <button className="order-primary" disabled={!addQuantity} onClick={add}>
              {addQuantity ? `Agregar al pedido · ${money(unitPrice(configured) * addQuantity)}` : `Ya tienes ${MAX_QUANTITY} en tu pedido`}
            </button>
          </div>}
          {step === 'cart' && (cart.length === 0
            ? <div className="empty-cart"><h3>Tu próximo antojo te espera.</h3><p>Agrega algo del menú para empezar.</p>
              <button className="order-primary" onClick={() => go('browse')}>Explorar menú</button></div>
            : <>
              {cart.map(line => {
                const product = products.get(line.id)!
                const key = lineKey(line)
                const label = product.name + (line.side ? ` con ${line.side}` : '')
                return <article key={key} className="cart-line">
                  <MenuPhoto item={product} compact /><div className="cart-line-copy">
                    <h3>{product.name}</h3><p>{product.description}</p>{line.side && <p>Combo: {line.side} + bebida</p>}
                    <strong>{money(unitPrice(line) * line.quantity)}</strong></div>
                  <div className="quantity-control">
                    <button aria-label={`Reducir ${label}`} onClick={() => line.quantity === 1 ? removeLine(key) : change(key, -1)}>−</button>
                    <output aria-label={`Cantidad de ${label}`} aria-live="polite">{line.quantity}</output>
                    <button aria-label={`Aumentar ${label}`} disabled={line.quantity >= MAX_QUANTITY} onClick={() => change(key, 1)}>+</button>
                  </div>
                  <button className="remove-line" onClick={() => removeLine(key)} aria-label={`Eliminar ${label}`}>Eliminar</button>
                </article>
              })}
              <button className="glass-action" onClick={() => go('browse')}>+ Agregar más productos</button>
              <div className="cart-total"><span>Subtotal de productos</span><strong>{money(total)}</strong></div>
              <p className="order-hint">Elige retiro o entrega en el siguiente paso. Ajitate confirmará la disponibilidad y el total.</p>
              <button className="order-primary" onClick={() => go('details')}>Continuar →</button>
            </>)}
          {step === 'details' && <form className="checkout-form" onSubmit={review}>
            <div className="checkout-panel">
              <FulfillmentChoices method={method} onChange={value => { setMethod(value); setQuote(null); if (value === 'pickup') setIncludePin(false) }} />
              {method === 'delivery' && <div className="checkout-delivery">
                <label className="form-label">Dirección y referencia<textarea className="order-input" ref={addressInput} name="address" required maxLength={400}
                  placeholder="Calle, número y una referencia para llegar" autoComplete="street-address" value={address}
                  onChange={event => updateAddress(event.target.value)} /></label>
                <Suspense fallback={<p className="order-hint" role="status">Cargando mapa opcional…</p>}>
                  <DeliveryPin pin={pin} include={includePin} onInclude={setIncludePin} hasAddress={Boolean(address.trim())}
                    onUseAddress={updateAddress}
                    onChange={point => { setPin(point); setQuote(null); if (!point) setIncludePin(false) }} />
                </Suspense>
                <DeliveryQuote address={address} pin={pin} quote={quote} onChange={setQuote} />
              </div>}
            </div>
            <fieldset className="checkout-panel checkout-contact"><legend>Tus datos</legend>
              <label className="form-label">Tu nombre<input className="order-input" required pattern=".*\S.*" title="Escribe tu nombre"
                maxLength={80} autoComplete="name" value={name} onChange={event => setName(event.target.value)} /></label>
              <label className="form-label">Teléfono<input className="order-input" name="phone" required type="tel" inputMode="tel" maxLength={32}
                autoComplete="tel" value={phone} placeholder="Tu número de celular" onChange={event => { event.target.setCustomValidity(''); setPhone(event.target.value) }}
                onBlur={() => setPhone(formatPhone(phone))} /></label>
            </fieldset>
            <div className="checkout-panel"><PaymentChoices method={method} payment={payment} onChange={setPayment} /></div>
            <details className="checkout-panel checkout-extras">
              <summary>Extras y notas <span>Opcional</span></summary>
              <fieldset><legend>Sin recargo</legend>
                <label className="option-choice"><input type="checkbox" checked={napkins} onChange={event => setNapkins(event.target.checked)} />Servilletas</label>
                {hasBeverage && <label className="option-choice"><input type="checkbox" checked={straws} onChange={event => setStraws(event.target.checked)} />Sorbetes</label>}
              </fieldset>
              <label className="form-label">Notas para el restaurante<textarea className="order-input" maxLength={600}
                placeholder="Preferencias, alergias o consultas…" value={notes} onChange={event => setNotes(event.target.value)} /></label>
            </details>
            <div className="checkout-foot">
              <div><span>Subtotal de productos</span><strong>{money(total)}</strong></div>
              <p>{method === 'delivery' ? 'Ajitate confirmará el envío y el total antes del pago.' : 'El restaurante confirmará la disponibilidad y la hora de retiro.'}</p>
              <button className="order-primary" type="submit">Revisar pedido <span aria-hidden="true">→</span></button>
            </div>
          </form>}
          {step === 'summary' && <div className="checkout-review">
            <article className="checkout-receipt" aria-label="Tu pedido para consultar">
              <header><h3>Resumen del pedido</h3><span>{count} {count === 1 ? 'producto' : 'productos'}</span></header>
              <ul>{cart.map(line => <li key={lineKey(line)}>
                <span className="receipt-quantity">{line.quantity}×</span><div><strong>{products.get(line.id)!.name}</strong>
                  {line.side && <small>Combo con {line.side.toLowerCase()} + bebida</small>}</div>
                <span className="receipt-price">{money(unitPrice(line) * line.quantity)}</span>
              </li>)}</ul>
              <dl className="receipt-details">
                <div><dt>{method === 'delivery' ? 'Entrega a domicilio' : 'Retiro en el local'}</dt><dd>{method === 'delivery' ? address.trim() : 'Av. Don Bosco, Cuenca'}</dd></div>
                {method === 'delivery' && pin && includePin && <div><dt>Punto de entrega</dt><dd><a href={deliveryPointUrl(pin)} target="_blank" rel="noreferrer">Ver en el mapa ↗</a></dd></div>}
                <div><dt>Contacto</dt><dd>{name.trim()}<br />{formatPhone(phone)}</dd></div>
                <div><dt>Preferencia de pago</dt><dd>{payment ? `${payment} · por confirmar` : 'Por definir'}</dd></div>
                <div><dt>Estado del pago</dt><dd>Pendiente</dd></div>
                {(napkins || (hasBeverage && straws)) && <div><dt>Extras</dt><dd>{[napkins && 'Servilletas', hasBeverage && straws && 'Sorbetes'].filter(Boolean).join(' y ')}</dd></div>}
                {notes.trim() && <div><dt>Notas</dt><dd>{notes.trim()}</dd></div>}
              </dl>
              <div className="receipt-subtotal"><span>Subtotal de productos</span><strong>{money(total)}</strong></div>
              {method === 'delivery' && <div className="receipt-fee"><span>Envío{currentQuote && ' cotizado'}</span><strong>{feeText(currentQuote)}</strong></div>}
              <div className="receipt-fee"><span>Total estimado</span><strong>{totalText(currentQuote)}</strong></div>
            </article>
            <div className="checkout-handoff">
              <p>{handoff.direct ? 'WhatsApp abrirá el chat de Ajitate con tu pedido listo para enviar.' : 'Abre WhatsApp y selecciona el contacto de Ajitate para enviar tu pedido.'} El restaurante confirmará disponibilidad y total.</p>
              <a className="checkout-whatsapp" href={handoff.href} target="_blank" rel="noopener noreferrer" onClick={event => {
                event.currentTarget.href = whatsAppDraft(latestSummary(), import.meta.env.VITE_AJITATE_WHATSAPP_NUMBER).href
              }}><CheckoutIcon name="message" /> Abrir en WhatsApp <span aria-hidden="true">↗</span></a>
              <button className="checkout-copy" onClick={copy}><CheckoutIcon name="copy" />{copied ? 'Resumen copiado ✓' : 'Copiar resumen del pedido'}</button>
              {copied && <p role="status">Puedes pegar el resumen en tu conversación con Ajitate.</p>}
              <details ref={draftPreview} className="checkout-draft"><summary>Ver mensaje completo</summary>
                <textarea ref={summaryText} className="order-summary" aria-label="Resumen del pedido" readOnly value={summary} />
              </details>
              <div className="checkout-secondary"><button className="checkout-text-link" onClick={() => go('details')}>Editar datos</button>
                <a href="tel:+593983047406">Llamar al (098) 304-7406 ↗</a></div>
            </div>
          </div>}
        </div>
        {showFloatingCart && <div className="drawer-cart-float">
          <button className="drawer-cart-bubble" onClick={() => go('cart')}>Ver carrito · {count} {count === 1 ? 'producto' : 'productos'} · {money(total)} →</button>
        </div>}
      </div>}
    </dialog>
  </>
}
