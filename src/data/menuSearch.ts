import type { MenuItem } from './menu'

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()
}

export function matchesMenuSearch(item: MenuItem, query: string) {
  const searchable = normalize(`${item.name} ${item.category} ${item.description}`)
  return searchable.includes(normalize(query))
}
