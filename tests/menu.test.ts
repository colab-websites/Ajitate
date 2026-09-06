import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MENU, subtotal, unitPrice, lineKey } from '../src/data/menu.ts'

test('all 47 menu options have unique identities and integer-cent prices',()=>{
  assert.equal(MENU.length,47)
  assert.equal(new Set(MENU.map(i=>i.id)).size,47)
  assert.ok(MENU.every(i=>Number.isInteger(i.price)&&i.price>0))
})
test('mixed order charges combo upgrade per unit without rounding drift',()=>{
  assert.equal(subtotal([{id:'solo-queso',side:'Papas',quantity:2},{id:'costillas-familiar',side:'',quantity:1},{id:'agua',side:'',quantity:1}]),2797)
  assert.equal(subtotal([]),0)
})
test('plain and combo options remain separate cart lines',()=>{
  assert.notEqual(lineKey({id:'solo-queso',side:''}),lineKey({id:'solo-queso',side:'Papas'}))
  assert.notEqual(lineKey({id:'solo-queso',side:'Papas'}),lineKey({id:'solo-queso',side:'Chilli nachos'}))
  assert.equal(unitPrice({id:'solo-queso',side:'',quantity:1}),350)
})
test('specials do not get an unsupported combo surcharge',()=>{
  assert.equal(unitPrice({id:'costillas-premium',side:'Papas',quantity:1}),999)
  assert.throws(()=>unitPrice({id:'missing',side:'',quantity:1}))
})
