export const PAYMENT_METHODS = ['Deuna', 'Efectivo', 'Transferencia', 'Tarjeta'] as const
export type PaymentMethod = typeof PAYMENT_METHODS[number]
export type Fulfillment = 'delivery' | 'pickup'

export function paymentRequest(method: PaymentMethod, fulfillment: Fulfillment) {
  switch (method) {
    case 'Deuna': return '¿Me envían un enlace o QR de Deuna con el total confirmado?'
    case 'Transferencia': return '¿Me comparten los datos de la cuenta y el importe exacto para transferir?'
    case 'Tarjeta': return fulfillment === 'pickup'
      ? '¿Puedo pagar con tarjeta al retirar mi pedido?'
      : '¿Me envían un enlace para pagar con tarjeta cuando confirmen el envío?'
    case 'Efectivo': return fulfillment === 'pickup'
      ? '¿Puedo pagar en efectivo al retirar mi pedido?'
      : '¿Puedo pagar en efectivo al recibir el pedido?'
  }
}

export function whatsAppDraft(summary: string, verifiedRecipient?: string) {
  const number = (verifiedRecipient ?? '').trim().replace(/^\+/, '')
  const recipient = /^[1-9]\d{6,14}$/.test(number) ? number : ''
  return { href: `https://wa.me/${recipient}?text=${encodeURIComponent(summary)}`, direct: Boolean(recipient) }
}
