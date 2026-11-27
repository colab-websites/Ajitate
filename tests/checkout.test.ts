import assert from 'node:assert/strict'
import test from 'node:test'
import { whatsAppDraft } from '../src/data/checkout.ts'

test('opens a recipient chooser, preserving the exact contents of the guest’s draft', () => {
  const summary = 'Daniel & Ana\n2 × Piña Colada: $7,98\nReferencia: junto al #4'
  const { href, direct } = whatsAppDraft(summary)
  const url = new URL(href)
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/')
  assert.equal(url.searchParams.get('text'), summary)
  assert.equal(direct, false)
})

test('addresses a configured international number and falls back for invalid settings', () => {
  assert.equal(new URL(whatsAppDraft('Prueba', '+593998887777').href).pathname, '/593998887777')
  assert.equal(whatsAppDraft('Prueba', 'no definido').direct, false)
  assert.equal(whatsAppDraft('Prueba', '../x').direct, false)
})
