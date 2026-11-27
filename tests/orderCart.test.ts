import assert from 'node:assert/strict'
import test from 'node:test'
import { addCartLine, restoreCart } from '../src/data/orderCart.ts'
import { subtotal } from '../src/data/menu.ts'

test('refresh preserves separate configurations and recalculates their price from the menu', () => {
  const cart = [
    { id: 'solo-queso', side: 'Papas', quantity: 2 },
    { id: 'solo-queso', side: '', quantity: 1 },
  ]
  const restored = restoreCart(JSON.stringify(cart))
  assert.deepEqual(restored, cart)
  assert.equal(subtotal(restored), 1448)
})

test('outdated or malformed stored orders recover using only recognized items and options', () => {
  assert.deepEqual(restoreCart(null), [])
  assert.deepEqual(restoreCart('invalid'), [])
  assert.deepEqual(restoreCart('{}'), [])
  assert.deepEqual(restoreCart(JSON.stringify([
    null, { id: 'retired', quantity: 2, side: '' }, { id: 'agua', side: 'Papas', quantity: 2 },
    { id: 'agua', side: '', quantity: 0 }, { id: 'agua', side: '', quantity: 1.5 },
    { id: 'agua', side: '', quantity: 3, name: 'Ignored', price: 2 },
    { id: 'agua', side: '', quantity: 200 },
  ])), [{ id: 'agua', side: '', quantity: 99 }])
})

test('increasing a line at the quantity ceiling preserves the cart', () => {
  const cart = [{ id: 'agua', side: '', quantity: 98 }]
  const full = addCartLine(cart, { id: 'agua', side: '', quantity: 4 })
  assert.equal(full[0].quantity, 99)
  assert.equal(cart[0].quantity, 98)
  assert.equal(addCartLine(full, { id: 'agua', side: '', quantity: 1 }), full)
})
