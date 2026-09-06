import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPhone } from '../src/data/phone.ts'
test('formats Ecuador local and international numbers without changing their digits',()=>{
 assert.equal(formatPhone('0983047406'),'(098) 304-7406')
 assert.equal(formatPhone('+593983047406'),'+593 (98) 304-7406')
 assert.equal(formatPhone('(098) 304-7406'),'(098) 304-7406')
 assert.equal(formatPhone(''),'')
})
