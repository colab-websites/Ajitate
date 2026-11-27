import test from 'node:test'
import assert from 'node:assert/strict'
import { getOpeningStatus } from '../src/data/openingHours.ts'

test('Cuenca service windows include opening and exclude closing time', () => {
  const cases = [
    ['11:59', false, 'Abrimos hoy a las 12:00.'],
    ['12:00', true, 'Te atendemos hasta las 15:00.'],
    ['14:59', true, 'Te atendemos hasta las 15:00.'],
    ['15:00', false, 'Abrimos hoy a las 18:00.'],
    ['18:00', true, 'Te atendemos hasta las 22:00.'],
    ['21:59', true, 'Te atendemos hasta las 22:00.'],
    ['22:00', false, 'Abrimos mañana a las 12:00.'],
  ] as const
  for (const [time, open, detail] of cases) {
    const status = getOpeningStatus(new Date(`2026-11-24T${time}:00-05:00`))
    assert.equal(status.today.day, 'Martes')
    assert.equal(status.open, open)
    assert.equal(status.detail, detail)
  }
})

test('uses Cuenca weekdays across midnight UTC and both closed days', () => {
  const saturday = getOpeningStatus(new Date('2026-11-29T03:00:00Z'))
  assert.equal(saturday.today.day, 'Sábado')
  assert.equal(saturday.detail, 'Abrimos el martes a las 12:00.')
  assert.equal(getOpeningStatus(new Date('2026-11-29T12:00:00Z')).detail, 'Abrimos el martes a las 12:00.')
  assert.equal(getOpeningStatus(new Date('2026-11-30T22:00:00Z')).detail, 'Abrimos mañana a las 12:00.')
})
