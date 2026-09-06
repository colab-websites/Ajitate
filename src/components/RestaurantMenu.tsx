import { useState } from 'react'
import { CATEGORIES, MENU, money } from '../data/menu'
import type { MenuItem } from '../data/menu'

export function RestaurantMenu({onSelect}:{onSelect:(id:string)=>void}) {
  const [category,setCategory]=useState('Hamburguesas')
  const [search,setSearch]=useState('')
  const visible=MENU.filter(i=>search ? `${i.name} ${i.description}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : !i.special && i.category===category)
  const card=(item:MenuItem)=><article className="food-card liquid-panel" key={item.id}>
    <div className="food-card-copy"><span className="food-category">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="food-card-bottom"><strong>{money(item.price)}</strong><button className="glass-action" onClick={()=>onSelect(item.id)} aria-label={`Agregar ${item.name}`}>Agregar +</button></div></div>
  </article>
  return <>
    <section id="menu" className="restaurant-menu">
      <p className="section-kicker">TODOS TUS ANTOJOS, EN UN LUGAR</p><h2>EL MENÚ <span>AJITATE</span></h2><p className="menu-intro">Hamburguesas, tex-mex y algo para brindar. Elige tu favorito y ármalo a tu manera.</p>
      <div className="menu-toolbar"><div className="menu-tabs" role="group" aria-label="Categorías del menú">{CATEGORIES.map(c=><button key={c} aria-pressed={category===c&&!search} onClick={()=>{setCategory(c);setSearch('')}}>{c}</button>)}</div><input aria-label="Buscar en el menú" type="search" placeholder="Busca tu antojo…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
      {!search&&['Hamburguesas','Tex-Mex'].includes(category)&&<figure className="menu-category-photo"><img src={`${import.meta.env.BASE_URL}images/${category==='Hamburguesas'?'burgers':'texmex'}.png`} alt={`Imagen ilustrativa de ${category==='Hamburguesas'?'hamburguesa':'tacos de birria'}`} loading="lazy" /><figcaption>Imagen de categoría creada con IA · ilustrativa, no fotografía del plato real</figcaption><div><span>HAZLO COMBO</span><strong>+ {money(199)}</strong><p>Chilli nachos o papas + bebida</p></div></figure>}
      <p className="menu-result" role="status">{visible.length} opciones{search?` para “${search}”`:''}</p><div className="food-grid">{visible.map(card)}</div>{!visible.length&&<p className="empty-cart">No encontramos ese antojo. Prueba con otro nombre.</p>}
      <p className="menu-source">Precios del menú compartido. Disponibilidad y costo de entrega se confirman con el restaurante.</p>
    </section>
    <section id="especiales" className="restaurant-menu specials-menu"><p className="section-kicker">PARA DARTE UN GUSTO</p><h2>NUESTROS <span>ESPECIALES</span></h2><figure className="menu-category-photo"><img src={`${import.meta.env.BASE_URL}images/specials.png`} alt="Imagen ilustrativa de costillas BBQ con papas" loading="lazy"/><figcaption>Imagen de categoría creada con IA · ilustrativa, no fotografía del plato real</figcaption><div><span>BBQ, PARA COMPARTIR</span><strong>Mucho sabor.</strong></div></figure><h3 className="special-group">Edición especial</h3><div className="food-grid">{MENU.filter(i=>i.category==='Edición especial').map(card)}</div><h3 className="special-group">Especiales & acompañamientos</h3><div className="food-grid">{MENU.filter(i=>i.category==='Especiales').map(card)}</div></section>
  </>
}
