import { lineKey, MENU } from './menu.ts'
import type { CartLine } from './menu.ts'

export const MAX_QUANTITY = 99
export const CART_KEY = 'ajitate.order.v1'

export function addCartLine(cart: CartLine[], next: CartLine): CartLine[] {
  const key = lineKey(next)
  const current = cart.find(line => lineKey(line) === key)
  if (!current) return [...cart, { ...next, quantity: Math.min(MAX_QUANTITY, next.quantity) }]
  if (current.quantity >= MAX_QUANTITY) return cart
  return cart.map(line => line === current
    ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + next.quantity) }
    : line)
}

export function restoreCart(raw: string | null): CartLine[] {
  if (!raw) return []
  let records: unknown
  try {
    records = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(records)) return []

  let cart: CartLine[] = []
  for (const record of records) {
    if (record === null || typeof record !== 'object') continue
    const { id, side, quantity } = record
    const item = MENU.find(product => product.id === id)
    if (!item || !Number.isSafeInteger(quantity) || quantity < 1) continue
    if (side !== '' && !(item.combo && (side === 'Papas' || side === 'Chilli nachos'))) continue
    cart = addCartLine(cart, { id, side, quantity })
  }
  return cart
}
