import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPhone, isValidPhone } from '../src/data/phone.ts'
test('formats Ecuador local and international numbers without changing their digits',()=>{
 assert.equal(formatPhone('0983047406'),'(098) 304-7406')
 assert.equal(formatPhone('+593983047406'),'+593 (98) 304-7406')
 assert.equal(formatPhone('(098) 304-7406'),'(098) 304-7406')
 assert.equal(formatPhone(''),'')
})

test('unrecognized formats preserve every digit and invalid numbers remain editable', () => {
  assert.equal(formatPhone('+1 (202) 555-0198'), '+1 (202) 555-0198')
  assert.equal(formatPhone('098304740699'), '098304740699')
  assert.equal(isValidPhone('(098) 304-7406'), true)
  assert.equal(isValidPhone('+1 (202) 555-0198'), true)
  assert.equal(isValidPhone('1 (234)-'), false)
  assert.equal(isValidPhone('0991234567abc'), false)
})
