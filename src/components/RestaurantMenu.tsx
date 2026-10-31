import { MenuPhoto } from './MenuPhoto'
import { useState } from 'react'
import { CATEGORIES, MENU, money } from '../data/menu'
import type { MenuItem } from '../data/menu'

export function RestaurantMenu({onSelect,onQuickAdd}:{onSelect:(id:string)=>void;onQuickAdd:(id:string)=>void}) {
  const [expanded,setExpanded]=useState(false)
  const [specialsExpanded,setSpecialsExpanded]=useState(false)
  const [category,setCategory]=useState('Hamburguesas')
  const [search,setSearch]=useState('')
  const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim()
  const query=normalize(search)
  const visible=MENU.filter(i=>query ? normalize(`${i.name} ${i.description} ${i.category}`).includes(query) : !i.special && i.category===category)
  const card=(item:MenuItem)=><article className="food-card liquid-panel" key={item.id}><MenuPhoto item={item}/>
    <div className="food-card-copy"><span className="food-category">{item.category}</span><h3><button className="product-details" onClick={()=>onSelect(item.id)} aria-label={`Ver ${item.name}`}>{item.name}</button></h3><p>{item.description}</p><div className="food-card-bottom"><strong>{money(item.price)}</strong><button className="glass-action" onClick={()=>onQuickAdd(item.id)} aria-label={`Agregar ${item.name}`}>Agregar +</button></div></div>
  </article>
  return <>
    <section id="menu" className="restaurant-menu">
      <p className="section-kicker">HECHO CON PASIÓN PARA AGITAR EL CORAZÓN</p><h2>MENÚ <span>AJITATE</span></h2><p className="menu-intro">Hamburguesas, Tex-Mex y sabores de autor. Elige tu favorito y ármalo a tu manera.</p>
      <div className="menu-toolbar"><div className="menu-tabs" role="group" aria-label="Categorías del menú">{CATEGORIES.map(c=><button key={c} aria-pressed={category===c&&!search} onClick={()=>{setCategory(c);setSearch('');setExpanded(false)}}>{c}</button>)}</div><label className="menu-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input aria-label="Buscar en el menú" type="search" placeholder="Busca tu antojo…" value={search} onChange={e=>setSearch(e.target.value)} />{search&&<button aria-label="Limpiar búsqueda" onClick={()=>setSearch('')}>×</button>}</label></div>
      {!search&&['Hamburguesas','Tex-Mex'].includes(category)&&<figure className="menu-category-photo"><img src={`${import.meta.env.BASE_URL}images/combo.png`} alt="Opciones de combo: chilli nachos o papas, más una bebida" loading="lazy" /><div><span>HAZLO COMBO</span><strong>+ {money(199)}</strong><p>Bebida incluida + elige chilli nachos O papas</p></div></figure>}
      <p className="menu-result" role="status">{visible.length} opciones{search?` para “${search}”`:''}</p><div id="menu-products" className={`food-grid mobile-preview ${expanded||search?'is-expanded':''}`}>{visible.map(card)}</div>{visible.length>2&&!search&&<button className="glass-action mobile-show-more" aria-expanded={expanded} aria-controls="menu-products" onClick={()=>setExpanded(v=>!v)}>{expanded?'Ver menos ↑':`Ver las ${visible.length} opciones ↓`}</button>}{!visible.length&&<div className="menu-empty"><h3>No encontramos ese antojo.</h3><p>Prueba con otro nombre o vuelve a explorar el menú.</p><button className="glass-action" onClick={()=>setSearch('')}>Ver el menú</button></div>}
      <p className="menu-source">Imágenes ilustrativas. Disponibilidad y costo de entrega se confirman con el restaurante.</p>
    </section>
    <section id="especiales" className="restaurant-menu specials-menu"><p className="section-kicker">¿QUIERES ALGO INNOVADOR?</p><h2>NUESTROS <span>ESPECIALES</span></h2><p className="menu-intro">Sabores de autor para salir de la rutina.</p><figure className="menu-category-photo"><img src={`${import.meta.env.BASE_URL}images/specials.png`} alt="Costillas BBQ con papas" loading="lazy"/><div><span>BBQ, PARA COMPARTIR</span><strong>Mucho sabor.</strong></div></figure><h3 className="special-group">Edición especial</h3><div className="food-grid featured-food-grid">{MENU.filter(i=>i.category==='Edición especial').map(card)}</div><h3 className="special-group">Especiales & acompañamientos</h3><div id="special-products" className={`food-grid mobile-preview ${specialsExpanded?'is-expanded':''}`}>{MENU.filter(i=>i.category==='Especiales').map(card)}</div><button className="glass-action mobile-show-more" aria-expanded={specialsExpanded} aria-controls="special-products" onClick={()=>setSpecialsExpanded(v=>!v)}>{specialsExpanded?'Ver menos ↑':'Ver todos los acompañamientos ↓'}</button></section>
  </>
}
