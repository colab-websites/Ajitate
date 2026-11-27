import type { MenuItem } from '../data/menu'

export function MenuPhoto({ item, compact = false }: { item: MenuItem; compact?: boolean }) {
  const path = compact ? 'images/menu/thumbnails' : 'images/menu'
  const size = compact ? 192 : 896
  return (
    <figure className={`menu-product-photo${compact ? ' is-compact' : ''}`}>
      <img
        src={`${import.meta.env.BASE_URL}${path}/${item.id}.webp`}
        alt={`Imagen de ${item.name}${item.id === 'yummy-jam' ? ' con duraznos al lado' : ''}`}
        loading="lazy" decoding="async" width={size} height={size}
      />
    </figure>
  )
}
