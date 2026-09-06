import { useRef, useState } from 'react'

import { REVIEWS } from '../data/reviews'
const SOURCE='https://maps.app.goo.gl/FTVdfzcjXtNxwSw76'
export function TestimonialsSection() {
 const [position,setPosition]=useState(REVIEWS.length)
 const active=((position%REVIEWS.length)+REVIEWS.length)%REVIEWS.length
 const touch=useRef({x:0,y:0})
 const move=(delta:number)=>setPosition(i=>i+delta)
 return <section id="resenas" className="reviews-section" aria-label="Reseñas de Google" onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)move(dx>0?-1:1)}}>
   <div className="reviews-backdrop" aria-hidden="true">REVIEWS</div>
   <div className="reviews-heading"><p className="section-kicker">EXPERIENCIAS EN GOOGLE</p><h2>LA CALLE <span>HABLA</span></h2><a className="glass-action" href={SOURCE} target="_blank" rel="noreferrer">4,6 ★ · 67 reseñas en Google ↗</a><p className="reviews-date">Consultado en septiembre de 2026</p></div>
   <div className="review-deck">
    {[-2,-1,0,1,2].map(offset=>{const absolute=position+offset;const review=REVIEWS[((absolute%REVIEWS.length)+REVIEWS.length)%REVIEWS.length];return <article key={absolute} aria-hidden={offset!==0} className={`review-position ${offset===0?'is-active':''}`} style={{transform:`translateX(calc(-50% + ${offset} * var(--review-gap))) translateY(${Math.abs(offset)*32}px) scale(${offset===0?1:.91})`,opacity:Math.abs(offset)>1?0:1,zIndex:offset===0?3:1,filter:offset===0?'none':'blur(1.5px) brightness(.58)'}}><div className="review-glass-card liquid-panel"><div className="review-stars" aria-label={`${review.stars} de 5 estrellas`}>{'★'.repeat(review.stars)}<span className="review-empty-stars">{'★'.repeat(5-review.stars)}</span></div><blockquote>“{review.text}”</blockquote><div className="review-author"><span aria-hidden="true">{review.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><div><strong>{review.name}</strong><small>Extracto de reseña de Google</small></div></div></div></article>})}
   </div>
   <div className="review-controls"><button aria-label="Reseña anterior" onClick={()=>move(-1)}>←</button>{REVIEWS.map((r,i)=><button key={r.name} className="review-dot" aria-label={`Ver reseña ${i+1}`} aria-pressed={i===active} onClick={()=>{let delta=i-active;if(delta>REVIEWS.length/2)delta-=REVIEWS.length;if(delta< -REVIEWS.length/2)delta+=REVIEWS.length;move(delta)}}/>)}<button aria-label="Siguiente reseña" onClick={()=>move(1)}>→</button></div><p className="review-counter" aria-live="polite">{active+1} / {REVIEWS.length}</p>
 </section>
}
