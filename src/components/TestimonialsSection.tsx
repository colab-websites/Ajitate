import { useRef, useState } from 'react'
import { REVIEWS } from '../data/reviews'
import './testimonials.css'

const GOOGLE_MAPS = 'https://maps.app.goo.gl/FTVdfzcjXtNxwSw76'

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const review = REVIEWS[index]

  function move(delta: number) {
    setIndex(current => (current + delta + REVIEWS.length) % REVIEWS.length)
  }

  return (
    <section id="resenas" className="aj-reviews" aria-labelledby="reviews-title">
      <div className="aj-reviews-inner">
        <header className="aj-reviews-heading">
          <p className="section-kicker">Reseñas de Google</p>
          <h2 id="reviews-title">La calle <span>habla.</span></h2>
          <a href={GOOGLE_MAPS} target="_blank" rel="noreferrer">
            <strong aria-label="4,6 de 5 estrellas">4,6 <span aria-hidden="true">★</span></strong>
            <span>67 reseñas en Google <span aria-hidden="true">↗</span></span>
          </a>
          <p className="aj-reviews-date">Consultado en septiembre de 2026</p>
        </header>
        <div className="aj-review-reader" role="group" aria-label="Reseñas de comensales" aria-roledescription="carrusel"
          onKeyDown={event => {
            if (event.target instanceof HTMLSelectElement || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              move(event.key === 'ArrowLeft' ? -1 : 1)
            }
          }}
        >
          <div className="aj-review-navigation">
            <label className="aj-review-picker">
              <span className="sr-only">Elegir reseña</span>
              <select value={index} onChange={event => setIndex(Number(event.target.value))}>
                {REVIEWS.map((item, i) => <option key={item.name} value={i}>Reseña {i + 1} de {REVIEWS.length}</option>)}
              </select>
            </label>
            <div className="aj-review-buttons">
              <button type="button" aria-label="Reseña anterior" onClick={() => move(-1)}>←</button>
              <button type="button" aria-label="Siguiente reseña" onClick={() => move(1)}>→</button>
            </div>
          </div>
          <figure className="aj-review-quote" aria-live="polite" aria-atomic="true"
            onTouchStart={event => {
              touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
            }}
            onTouchCancel={() => { touchStart.current = null }}
            onTouchEnd={event => {
              const start = touchStart.current
              touchStart.current = null
              if (!start || event.touches.length) return
              const dx = event.changedTouches[0].clientX - start.x
              const dy = event.changedTouches[0].clientY - start.y
              if (Math.abs(dx) > 55 && Math.abs(dx) > 1.5 * Math.abs(dy)) move(dx < 0 ? 1 : -1)
            }}
          >
            <blockquote>“{review.text}”</blockquote>
            <figcaption><strong>{review.name}</strong><span className="aj-review-stars" role="img" aria-label={`${review.stars} de 5 estrellas`}>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
