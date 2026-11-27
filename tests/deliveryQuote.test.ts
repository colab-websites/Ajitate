import test from 'node:test'
import assert from 'node:assert/strict'
import { currentFeeQuote, deliveryRouteKey, quoteMoney, readFeeQuote } from '../src/data/deliveryQuote.ts'

test('fee is valid only for its current delivery address, pin, method and window', () => {
  const expires = Date.now() + 60000
  const address = 'Calle de prueba'
  const pin = { lat: -2.9, lng: -79 }
  const quote = readFeeQuote({ fee: 271, currency: 'USD', expiresAt: new Date(expires).toISOString() }, deliveryRouteKey(address, pin))
  assert.ok(quote)
  assert.equal(currentFeeQuote(quote, address, pin, true, expires - 1), quote)
  assert.equal(currentFeeQuote(quote, address, pin, true, expires), null)
  assert.equal(currentFeeQuote(quote, address, null, true), null)
  assert.equal(currentFeeQuote(quote, address, pin, false), null)
  assert.equal(currentFeeQuote(quote, 'Otra calle', pin, true), null)
  assert.match(quoteMoney({ fee: 271, currency: 'EUR' }), /EUR/)
  assert.equal(readFeeQuote({ fee: -8, currency: 'USD', expiresAt: quote.expiresAt }, quote.routeKey), null)
})
