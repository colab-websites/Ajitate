import type { Pin } from './deliveryPoint'

export type FeeQuote = {
  fee: number
  currency: string
  expiresAt: string
  dropoffEta: string | null
  routeKey: string
}

export function deliveryRouteKey(address: string, pin: Pin | null) {
  return JSON.stringify([address.trim(), pin?.lat ?? null, pin?.lng ?? null])
}

export function currentFeeQuote(quote: FeeQuote | null, address: string, pin: Pin | null, delivery: boolean, nowMs = Date.now()) {
  return delivery && quote && Date.parse(quote.expiresAt) > nowMs && quote.routeKey === deliveryRouteKey(address, pin) ? quote : null
}

export function quoteMoney(quote: Pick<FeeQuote, 'fee' | 'currency'>) {
  const format = new Intl.NumberFormat('es-EC', { style: 'currency', currency: quote.currency, currencyDisplay: 'code' })
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2
  return format.format(quote.fee / 10 ** digits)
}

export function readFeeQuote(data: unknown, routeKey: string): FeeQuote | null {
  if (!data || typeof data !== 'object') return null
  const { fee, currency, expiresAt, dropoffEta } = data as Partial<FeeQuote>
  if (typeof fee !== 'number' || !Number.isSafeInteger(fee) || fee < 0 || typeof currency !== 'string'
    || !/^[A-Z]{3}$/.test(currency) || typeof expiresAt !== 'string' || !(Date.parse(expiresAt) > Date.now())) return null
  return { fee, currency, expiresAt, routeKey, dropoffEta: typeof dropoffEta === 'string' && Number.isFinite(Date.parse(dropoffEta)) ? dropoffEta : null }
}
