import { useRef, useState } from 'react'
import './restaurant-editorial.css'

const photos = [
  {
    image: 'ajitate-guest-dining-2025-10-30.jpg',
    alt: 'Una comensal prueba su plato frente al mural de Ajitate.',
    title: 'En buena compañía',
    width: 1365,
    height: 1820,
    platform: 'Facebook',
    source: 'https://www.facebook.com/photo.php?fbid=122190652154358208&set=pb.61560746246876.-2207520000&type=3',
  },
  {
    image: 'ajitate-instagram-spread-2026-08-24.jpg',
    alt: 'Una mesa con hamburguesas, papas, salsas y bebidas frente a la pared pintada del local.',
    title: 'La mesa está servida',
    width: 640,
    height: 512,
    platform: 'Instagram',
    source: 'https://www.instagram.com/ajitate.ec/p/Dcc56NxFX5v/',
  },
  {
    image: 'ajitate-dining-room-2025-06-11.jpg',
    alt: 'Un comensal disfruta de su hamburguesa junto al letrero «A papá le gusta comer».',
    title: 'Nuestra casa',
    width: 1440,
    height: 1920,
    platform: 'Facebook',
    source: 'https://www.facebook.com/photo.php?fbid=122173514684358208&set=pb.61560746246876.-2207520000&type=3',
  },
]

const imageRoot = `${import.meta.env.BASE_URL}images/`

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6m0-6-7 7M10 20H4v-6m0 6 7-7" />
    </svg>
  )
}

export function MomentsGallery() {
  const [active, setActive] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const current = photos[active]
  const changePhoto = (delta: number) => setActive(index => (index + delta + photos.length) % photos.length)

  function openPhoto(index: number, button: HTMLButtonElement) {
    opener.current = button
    setActive(index)
    dialog.current?.showModal()
  }

  return (
    <section id="momentos" className="aj-moments" aria-labelledby="moments-title">
      <div className="aj-moments-inner">
        <header className="aj-moments-heading">
          <p className="section-kicker">Momentos en Ajitate</p>
          <h2 id="moments-title">Aquí se vive <span>el sabor.</span></h2>
        </header>
        <div className="aj-moments-grid">
          {photos.map((photo, index) => (
            <button className="aj-moments-tile" key={photo.image} type="button" onClick={event => openPhoto(index, event.currentTarget)} aria-label={`Ampliar foto: ${photo.title}`} aria-haspopup="dialog">
              <img src={imageRoot + photo.image} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              <span className="aj-moments-enlarge"><ExpandIcon /></span>
              <span className="aj-moments-label">{photo.title}</span>
            </button>
          ))}
        </div>
      </div>
      <dialog ref={dialog} className="aj-moments-dialog" aria-label="Galería de fotos de Ajitate"
        onClose={() => opener.current?.focus({ preventScroll: true })}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}
        onKeyDown={event => {
          if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            changePhoto(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}
      >
        <div className="aj-moments-viewer">
          <div className="aj-moments-bar">
            <span className="aj-moments-counter">Foto {active + 1} de {photos.length}</span>
            <button type="button" className="aj-moments-control" aria-label="Cerrar galería" onClick={() => dialog.current?.close()}><span aria-hidden="true">×</span></button>
          </div>
          <figure className="aj-moments-slide">
            <div className="aj-moments-stage"
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
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) changePhoto(dx < 0 ? 1 : -1)
              }}
            >
              <img src={imageRoot + current.image} alt={current.alt} width={current.width} height={current.height} loading="lazy" />
            </div>
            <figcaption className="aj-moments-caption">
              <div>
                <h3 aria-live="polite" aria-atomic="true">{current.title}<span className="sr-only">. Foto {active + 1} de {photos.length}.</span></h3>
                <a href={current.source} target="_blank" rel="noreferrer">Ver original en {current.platform} <span aria-hidden="true">↗</span></a>
              </div>
              <div className="aj-moments-arrows">
                <button type="button" className="aj-moments-control" aria-label="Foto anterior" onClick={() => changePhoto(-1)}><span aria-hidden="true">←</span></button>
                <button type="button" className="aj-moments-control" aria-label="Foto siguiente" onClick={() => changePhoto(1)}><span aria-hidden="true">→</span></button>
              </div>
            </figcaption>
          </figure>
        </div>
      </dialog>
    </section>
  )
}
