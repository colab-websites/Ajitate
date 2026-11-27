import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, MENU, money } from '../data/menu'
import type { MenuItem } from '../data/menu'
import { matchesMenuSearch } from '../data/menuSearch'
import { useIsDesktop } from '../hooks/useIsDesktop'
import { CaretDown, SearchIcon } from '../icons/Icons'
import { MenuPhoto } from './MenuPhoto'
import './restaurant-menu.css'

const categories = [...CATEGORIES.slice(0, 2), 'Especiales', ...CATEGORIES.slice(2)]
const edition = MENU.filter(item => item.category === 'Edición especial')
const ribs = MENU.filter(item => item.id === 'costillas-premium' || item.id === 'costillas-familiar')
const sides = MENU.filter(item => item.category === 'Especiales' && !ribs.includes(item))
const favoritesKey = 'ajitate.menu.favorites.v1'

type MenuActions = {
  onSelect: (id: string) => void
  onQuickAdd: (id: string) => void
}

function readFavorites() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(favoritesKey) ?? '[]')
    return Array.isArray(saved) ? MENU.filter(item => saved.includes(item.id)).map(item => item.id) : []
  } catch {
    return []
  }
}

function Heart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 4.9a5 5 0 0 0-7.1 0L12 6.3l-1.4-1.4a5 5 0 0 0-7.1 7.1l8.5 8.3 8.5-8.3a5 5 0 0 0 0-7.1Z" />
    </svg>
  )
}

function SaveDish({ item, saved, onToggle }: { item: MenuItem; saved: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="dish-save" aria-label={`Favorito: ${item.name}`} aria-pressed={saved}
      title={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'} onClick={onToggle}>
      <Heart />
    </button>
  )
}

export function RestaurantMenu({ onSelect, onQuickAdd }: MenuActions) {
  const isDesktop = useIsDesktop()
  const pageSize = isDesktop ? 6 : 3
  const [pages, setPages] = useState(1)
  const [sidesExpanded, setSidesExpanded] = useState(false)
  const [category, setCategory] = useState(categories[0])
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>(readFavorites)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [ribIndex, setRibIndex] = useState(0)
  const searchField = useRef<HTMLInputElement>(null)
  const favoritesButton = useRef<HTMLButtonElement>(null)
  const results = useRef<HTMLDivElement>(null)
  const selectedRibs = ribs[ribIndex]
  const query = search.trim()
  const visible = MENU.filter(item => {
    if (onlyFavorites) return favorites.includes(item.id)
    if (query) return matchesMenuSearch(item, query)
    return category === 'Especiales' ? item.special : item.category === category
  })
  const shown = visible.slice(0, pageSize * pages)
  const showCombo = !query && !onlyFavorites && (category === 'Hamburguesas' || category === 'Tex-Mex')

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === favoritesKey || event.key === null) setFavorites(readFavorites())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id]
    setFavorites(next)
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(next))
    } catch {
      // Favorites remain available for this visit when browser storage is disabled.
    }
    if (onlyFavorites && results.current?.contains(document.activeElement)) {
      const position = shown.findIndex(item => item.id === id)
      requestAnimationFrame(() => {
        const remaining = results.current?.querySelectorAll<HTMLButtonElement>('.dish-save')
        const target = remaining?.[Math.min(position, remaining.length - 1)]
        const nextFocus = target ?? favoritesButton.current
        nextFocus?.focus()
      })
    }
  }

  function chooseCategory(value: string) {
    setCategory(value)
    setOnlyFavorites(false)
    setSearch('')
    setPages(1)
  }

  function updateSearch(value: string) {
    setOnlyFavorites(false)
    setSearch(value)
    setPages(1)
  }

  function renderCard(item: MenuItem) {
    return (
      <article className="food-card liquid-panel" key={item.id}>
        <MenuPhoto item={item} />
        <SaveDish item={item} saved={favorites.includes(item.id)} onToggle={() => toggleFavorite(item.id)} />
        <div className="food-card-copy">
          <span className="food-category">{item.category}</span>
          <h3><button type="button" className="product-details" onClick={() => onSelect(item.id)} aria-label={`Ver ${item.name}`}>{item.name}</button></h3>
          <p>{item.description}</p>
          <div className="food-card-bottom">
            <strong>{money(item.price)}</strong>
            <button type="button" className="dish-add" onClick={() => onQuickAdd(item.id)} aria-label={`Agregar ${item.name}`}>
              Agregar <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <>
      <section id="menu" className="restaurant-menu menu-catalog" aria-labelledby="menu-title">
        <header className="catalog-heading">
          <h2 id="menu-title">MENÚ <span>AJITATE</span></h2>
          <div className="catalog-tools">
            <div className="catalog-search" role="search" aria-label="Menú">
              <SearchIcon />
              <input ref={searchField} type="search" aria-label="Buscar en el menú" placeholder="Busca un plato o ingrediente"
                value={search} onChange={event => updateSearch(event.target.value)} />
              {search && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { updateSearch(''); searchField.current?.focus() }}>×</button>}
            </div>
            <button ref={favoritesButton} type="button" className="catalog-favorites" aria-pressed={onlyFavorites} onClick={() => {
              setOnlyFavorites(value => !value)
              setSearch('')
              setPages(1)
            }}>
              <Heart /> <span className="favorites-label">Favoritos</span> <span className="saved-count">{favorites.length}</span>
            </button>
          </div>
        </header>
        <div className="catalog-categories" role="group" aria-label="Categorías del menú">
          {categories.map(value => (
            <button type="button" key={value} aria-pressed={!query && !onlyFavorites && category === value} onClick={() => chooseCategory(value)}>
              {value === 'Cocteles' ? 'Cócteles' : value}
            </button>
          ))}
        </div>
        <div className="catalog-result-row">
          <p className="catalog-result" role="status">
            {visible.length} {visible.length === 1 ? 'opción' : 'opciones'}{query ? ` para “${query}”` : onlyFavorites ? ' en favoritos' : ''}
          </p>
          {showCombo && <p className="catalog-combo"><b>Hazlo combo</b> <span>+ {money(199)}</span><i aria-hidden="true">·</i> Papas o chilli nachos y bebida.</p>}
        </div>
        <div id="menu-products" ref={results} className="food-grid">{shown.map(renderCard)}</div>
        {shown.length < visible.length && <button type="button" className="catalog-more" aria-controls="menu-products" onClick={() => {
          const nextIndex = shown.length
          setPages(value => value + 1)
          requestAnimationFrame(() => results.current?.querySelectorAll<HTMLButtonElement>('.product-details')[nextIndex]?.focus({ preventScroll: true }))
        }}>
          Ver más opciones <CaretDown />
        </button>}
        {!visible.length && (
          <div className="menu-empty">
            {onlyFavorites && <Heart />}
            <h3>{onlyFavorites ? 'Tus favoritos van aquí.' : 'No encontramos ese antojo.'}</h3>
            <p>{onlyFavorites ? 'Toca el corazón de un plato para guardarlo.' : 'Prueba con otro plato o ingrediente.'}</p>
            <button type="button" className="catalog-more" onClick={() => { chooseCategory(category); searchField.current?.focus() }}>Ver el menú</button>
          </div>
        )}
        <p className="menu-source">Imágenes ilustrativas. Disponibilidad y costo de entrega se confirman con el restaurante.</p>
      </section>

      <section id="especiales" className="restaurant-menu specials-menu menu-catalog" aria-labelledby="specials-title">
        <h2 id="specials-title">NUESTROS <span>ESPECIALES</span></h2>
        <article className="ribs-feature">
          <div className="ribs-photo">
            <MenuPhoto item={selectedRibs} />
            <SaveDish item={selectedRibs} saved={favorites.includes(selectedRibs.id)} onToggle={() => toggleFavorite(selectedRibs.id)} />
          </div>
          <div className="ribs-copy">
            <h3>Costillas BBQ</h3>
            <div className="ribs-sizes" role="group" aria-label="Presentación de las costillas">
              {ribs.map((item, index) => <button key={item.id} type="button" aria-pressed={index === ribIndex} onClick={() => setRibIndex(index)}>{item.name.split(' · ')[1]}</button>)}
            </div>
            <div className="ribs-details" aria-live="polite" aria-atomic="true"><p>{selectedRibs.description}</p><strong>{money(selectedRibs.price)}</strong></div>
            <div className="ribs-actions">
              <button type="button" className="dish-add" onClick={() => onQuickAdd(selectedRibs.id)} aria-label={`Agregar ${selectedRibs.name}`}>Agregar <span aria-hidden="true">+</span></button>
              <button type="button" className="ribs-view" onClick={() => onSelect(selectedRibs.id)} aria-label={`Ver ${selectedRibs.name}`}>Ver plato <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </article>
        <h3 className="special-group">Edición especial</h3>
        <div className="food-grid featured-food-grid">{edition.map(renderCard)}</div>
        <h3 className="special-group">Acompañamientos</h3>
        <div id="special-products" className="food-grid">{(isDesktop || sidesExpanded ? sides : sides.slice(0, 3)).map(renderCard)}</div>
        {!isDesktop && !sidesExpanded && <button type="button" className="catalog-more" aria-controls="special-products" onClick={() => {
          setSidesExpanded(true)
          requestAnimationFrame(() => document.querySelectorAll<HTMLButtonElement>('#special-products .product-details')[3]?.focus({ preventScroll: true }))
        }}>Ver todos los acompañamientos <CaretDown /></button>}
      </section>
    </>
  )
}
