import type { ReactNode } from 'react'
import { PAYMENT_METHODS, paymentRequest } from '../data/checkout'
import type { Fulfillment, PaymentMethod } from '../data/checkout'

const glyphs: Record<Fulfillment | PaymentMethod | 'message' | 'copy', ReactNode> = {
  delivery: <><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
  pickup: <><path d="M3 10l2-6h14l2 6M4 10v10h16V10M3 10c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0M8 20v-5h4v5"/></>,
  Deuna: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M11 19h2m-5-7 2 2 5-5"/></>,
  Efectivo: <><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 12h1m12 0h1"/></>,
  Transferencia: <><path d="M3 8h16m-4-4 4 4-4 4M21 16H5m4-4-4 4 4 4"/></>,
  Tarjeta: <><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/></>,
  message: <><path d="M21 11a9 9 0 0 1-13.5 7.9L3 20l1.1-4.1A9 9 0 1 1 21 11Z"/><path d="M8.5 8.5c.6 3 2.4 4.8 5.5 5.7l1.5-1.4"/></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
}
export function CheckoutIcon({ name }: { name: keyof typeof glyphs }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{glyphs[name]}</svg>
}

export function FulfillmentChoices({ method, onChange }: { method: Fulfillment; onChange: (method: Fulfillment) => void }) {
  return <fieldset className="checkout-options"><legend>¿Cómo quieres recibirlo?</legend>
    <div className="fulfillment-options">{(['delivery','pickup'] as const).map(value =>
      <label key={value} className="checkout-choice fulfillment-choice">
        <input type="radio" name="delivery" value={value} checked={method === value} onChange={() => onChange(value)} />
        <CheckoutIcon name={value} /><span><strong>{value === 'delivery' ? 'A domicilio' : 'Retiro en el local'}</strong>
          <small>{value === 'delivery' ? 'Envío por cotizar' : 'Av. Don Bosco, Cuenca'}</small></span>
      </label>)}</div>
  </fieldset>
}

export function PaymentChoices({ payment, method, onChange }: { method: Fulfillment; payment: PaymentMethod | ''; onChange: (method: PaymentMethod | '') => void }) {
  return <fieldset className="checkout-options payment-options"><legend>¿Cómo prefieres pagar?</legend>
    <p>Elige qué método consultar con Ajitate.</p>
    <div className="payment-grid">{PAYMENT_METHODS.map(value =>
      <label key={value} className="checkout-choice payment-choice">
        <input type="radio" name="payment" value={value} checked={payment === value} onChange={() => onChange(value)} />
        <CheckoutIcon name={value} /><strong>{value}</strong>
      </label>)}</div>
    {payment && <p className="checkout-payment-note" role="status"><strong>En tu mensaje</strong> {paymentRequest(payment, method)}</p>}
    {payment && <button className="checkout-text-link" type="button" onClick={() => onChange('')}>Decidir después</button>}
  </fieldset>
}
