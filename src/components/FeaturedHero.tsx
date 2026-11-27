import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { MENU, money } from '../data/menu'
import { BrandFilm } from './HeroVideo'
import { BrandLogo } from './BrandLogo'

const imageRoot = `${import.meta.env.BASE_URL}images/menu/`
const featured = ['ajitate-burger', 'tacos-birria', 'chilli-nachos'].map(id => MENU.find(item => item.id === id)!)

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
  </svg>
}

function BrandSeal() {
  return <div className="cover-seal" aria-label="50% Tex-Mex, 50% Ajitate">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><path id="seal-type" d="M50,50m-37,0a37,37 0 1,1 74,0a37,37 0 1,1 -74,0" /></defs>
      <text textLength="230"><textPath href="#seal-type" textLength="230">50% TEX-MEX · 50% AJITATE · </textPath></text>
    </svg>
    <BrandLogo circle className="cover-seal-mark" />
  </div>
}

export function FeaturedHero({ onSelect }: { onSelect: (id: string) => void }) {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const dish = featured[selected]
  const activateWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const destinations: Record<string, number> = { ArrowRight: (index + 1) % featured.length, ArrowLeft: (index + featured.length - 1) % featured.length, Home: 0, End: featured.length - 1 }
    if (!(event.key in destinations)) return
    event.preventDefault()
    const next = destinations[event.key]
    setSelected(next)
    tabs.current[next]?.focus()
  }

  return <section id="inicio" className="cover" aria-labelledby="cover-title">
    <div className="cover-layout">
      <div className="cover-copy">
        <p className="cover-location"><span aria-hidden="true" /> Cuenca, Ecuador</p>
        <h1 id="cover-title">La pasión<br /><em>de comer.</em></h1>
        <p className="cover-description">Hamburguesas smash, tacos de birria y burritos. Tex-Mex con el toque de nuestra casa.</p>
        <div className="cover-actions"><a className="cover-menu-link" href="#menu">Explorar el menú <Arrow /></a><BrandFilm /></div>
      </div>
      <div className="cover-stage" role="tabpanel" id="featured-dish" aria-labelledby={`feature-${dish.id}`} tabIndex={0}>
        <div className="cover-photo" key={dish.id}><img src={`${imageRoot}${dish.id}.webp`} alt={`Imagen ilustrativa de ${dish.name}`} fetchPriority="high" width="896" height="896" /></div>
        <BrandSeal />
        <button className="cover-caption" onClick={() => onSelect(dish.id)} aria-label={`Ver opciones de ${dish.name}, ${money(dish.price)}`}>
          <span className="cover-caption-rule" aria-hidden="true" />
          <span><small>{dish.category}</small><strong>{dish.name}</strong></span>
          <span className="cover-caption-price">{money(dish.price)} <Arrow diagonal /></span>
        </button>
      </div>
    </div>
    <div className="cover-selection">
      <span className="cover-selection-title" id="cover-picks-label">En portada</span>
      <div className="cover-picks" role="tablist" aria-labelledby="cover-picks-label">
        {featured.map((item, index) => <button key={item.id} id={`feature-${item.id}`} type="button" role="tab" aria-selected={index === selected} aria-controls="featured-dish" tabIndex={index === selected ? 0 : -1} ref={el => { tabs.current[index] = el }} onKeyDown={event => activateWithKeyboard(event, index)} onClick={() => setSelected(index)}>
          <img src={`${imageRoot}thumbnails/${item.id}.webp`} width="60" height="60" alt="" />
          <span>{item.name}</span><span className="cover-pick-mark" aria-hidden="true">↗</span>
        </button>)}
      </div>
    </div>
  </section>
}
