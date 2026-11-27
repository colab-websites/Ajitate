const cuencaClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Guayaquil',
  weekday: 'short',
  hour: '2-digit',
  hourCycle: 'h23',
})

const serviceHours = [[12, 15], [18, 22]] as const
export const weeklyHours = [
  { day: 'Lunes', key: 'Mon', hours: [] },
  { day: 'Martes', key: 'Tue', hours: serviceHours },
  { day: 'Miércoles', key: 'Wed', hours: serviceHours },
  { day: 'Jueves', key: 'Thu', hours: serviceHours },
  { day: 'Viernes', key: 'Fri', hours: serviceHours },
  { day: 'Sábado', key: 'Sat', hours: serviceHours },
  { day: 'Domingo', key: 'Sun', hours: [] },
] as const

export function getOpeningStatus(date: Date) {
  const parts = cuencaClock.formatToParts(date)
  const weekday = parts.find(part => part.type === 'weekday')?.value
  const hour = Number(parts.find(part => part.type === 'hour')?.value)
  const index = weeklyHours.findIndex(day => day.key === weekday)
  const today = weeklyHours[index]

  for (const [start, end] of today.hours) {
    if (hour < start) {
      return { today, open: false, detail: `Abrimos hoy a las ${start}:00.` }
    }
    if (hour < end) {
      return { today, open: true, detail: `Te atendemos hasta las ${end}:00.` }
    }
  }

  let daysAhead = 1
  while (!weeklyHours[(index + daysAhead) % 7].hours.length) daysAhead++
  const next = weeklyHours[(index + daysAhead) % 7]
  const when = daysAhead === 1 ? 'mañana' : `el ${next.day.toLowerCase()}`
  return { today, open: false, detail: `Abrimos ${when} a las ${next.hours[0]![0]}:00.` }
}
