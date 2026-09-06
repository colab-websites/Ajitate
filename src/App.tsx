import { useEffect, useRef, useState } from 'react'

const LOGO = 'https://res.cloudinary.com/dlsw7vg31/image/upload/v1786686042/AJITATE_LOGO_sin_slogan_f9iqsw.png'
const links = [['Inicio', '#inicio'], ['Menú', '#menu'], ['Especiales', '#especiales'], ['Nosotros', '#nosotros'], ['Ubicación', '#ubicacion']]
const dishes = [
  { name: 'Burger Texana', category: 'Hamburguesas', detail: 'El clásico antojo, con actitud tex-mex.', number: '01' },
  { name: 'Tacos al Pastor', category: 'Tacos', detail: 'Pequeños bocados. Mucho sabor.', number: '02' },
  { name: 'Burrito Gigante', category: 'Burritos', detail: 'Para cuando el hambre viene en serio.', number: '03' },
  { name: 'Costillas BBQ', category: 'Parrilla', detail: 'El lado más intenso de la mesa.', number: '04' },
  { name: 'Papas BBQ', category: 'Para compartir', detail: 'El acompañante que se roba la atención.', number: '05' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState('Todo')
  const [selectedDish, setSelectedDish] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.current?.play().catch(() => setVideoPlaying(false))
    }
  }, [])
  const toggleVideo = () => {
    if (!video.current) return
    if (video.current.paused) video.current.play().catch(() => setVideoPlaying(false))
    else video.current.pause()
  }
  const openOrder = (dish = '') => {
    setSelectedDish(dish)
    dialog.current?.showModal()
  }

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <div className="header-inner">
        <a href="#inicio" className="brand" aria-label="Ajitate, inicio"><img src={LOGO} alt="Ajitate" width="112" height="88" /></a>
        <nav className="desktop-nav" aria-label="Navegación principal">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="header-actions">
          <button className="button button-red header-order" onClick={() => openOrder()}>Pide aquí <span aria-hidden="true">↗</span></button>
          <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Cerrar ×' : 'Menú ☰'}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Navegación móvil">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav>}
    </header>
    <main id="contenido">
      <section id="inicio" className="hero-section page-width">
        <div className="hero-copy">
          <p className="eyebrow"><span className="red-dot" /> TEX-MEX EN CUENCA, ECUADOR</p>
          <h1>SABOR<br />QUE <span>AJITA.</span></h1>
          <p className="hero-description">Buenas conversaciones. Grandes antojos.<br />Una mesa para compartirlo todo.</p>
          <div className="hero-actions"><a className="button button-red" href="#menu">Explora el menú <span aria-hidden="true">↗</span></a><a className="text-link" href="#nosotros">Conoce Ajitate <span aria-hidden="true">↓</span></a></div>
          <div className="hero-footnote"><span>HAMBURGUESAS</span><span>TACOS</span><span>BBQ</span></div>
        </div>
        <figure className="hero-visual">
          <video ref={video} src="https://res.cloudinary.com/dlsw7vg31/video/upload/v1786686488/ElevenLabs_video_seedance-2-0_replicate_the_V_2026-08-14T05_43_39_hobtha.mp4" muted loop playsInline preload="metadata" aria-label="Video de presentación de Ajitate: hamburguesa" onPlay={() => setVideoPlaying(true)} onPause={() => setVideoPlaying(false)} onError={() => setVideoFailed(true)} />
          {videoFailed ? <p className="video-error" role="status">El video no se pudo cargar. Puedes seguir explorando el menú.</p> : <button className="video-control" onClick={toggleVideo} aria-label={videoPlaying ? 'Pausar video' : 'Reproducir video'}>{videoPlaying ? 'Pausar Ⅱ' : 'Reproducir ▷'}</button>}
          <div className="hero-stamp" aria-hidden="true">FAMILIA<br /><span>& SABOR</span></div>

        </figure>
      </section>
      <div className="flavor-strip" aria-hidden="true"><span>BUENA COMIDA</span><b>✳</b><span>BUENA COMPAÑÍA</span><b>✳</b><span>MUCHO SABOR</span><b>✳</b><span>AJITATE</span></div>
      <section id="menu" className="menu-section page-width section-space">
        <div className="section-heading"><div><p className="eyebrow">AQUÍ EMPIEZA EL ANTOJO</p><h2>ELIGE TU<br /><span>PRÓXIMO FAVORITO.</span></h2></div><p className="section-description">Una primera mirada a nuestra propuesta.<br /><span className="draft-note">Menú de muestra: platos, ingredientes y precios por confirmar.</span></p></div>
        <div className="category-list" role="group" aria-label="Filtrar menú">{['Todo', ...dishes.map(d => d.category)].map(c => <button key={c} className={category === c ? 'category active' : 'category'} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <p className="sr-only" role="status">{category === 'Todo' ? dishes.length : 1} platos de muestra</p>
        <div className="dish-grid">{dishes.filter(d => category === 'Todo' || d.category === category).map(d => <article className="dish-card" key={d.name}>
          <div className="dish-placeholder"><span className="dish-number" aria-hidden="true">{d.number}</span><span className="placeholder-label">FOTO OFICIAL PENDIENTE</span><span className="dish-category">{d.category}</span></div>
          <div className="dish-content"><h3>{d.name}</h3><p>{d.detail}</p><div className="dish-bottom"><span>Precio por confirmar</span><button aria-label={`Consultar ${d.name}`} onClick={() => openOrder(d.name)}>Consultar <span aria-hidden="true">↗</span></button></div></div>
        </article>)}</div>
      </section>
      <section id="especiales" className="special-section page-width">
        <div><p className="eyebrow">ALGO BUENO SE ESTÁ COCINANDO</p><h2>PRÓXIMOS<br /><span>ESPECIALES.</span></h2></div>
        <div className="special-copy"><p>Este espacio será para los especiales y promociones de Ajitate.</p><p className="draft-note">Próximamente: promociones confirmadas por el restaurante.</p><a className="text-link" href="#menu">Mientras tanto, explora el menú <span aria-hidden="true">↗</span></a></div>
      </section>
      <section id="nosotros" className="story-section page-width section-space">
        <div className="story-art"><span className="eyebrow">CUENCA · ECUADOR</span><p>LA MESA<br />ES MEJOR<br /><span>CONTIGO.</span></p><span className="placeholder-label">ESPACIO PARA UNA FOTO DEL EQUIPO</span></div>
        <div className="story-copy"><p className="eyebrow">ESTO ES AJITATE</p><h2>FAMILIA.<br />AMIGOS.<br /><span>TEX-MEX.</span></h2><p>Un lugar para encontrarnos alrededor de lo que más nos gusta: la comida y la buena compañía.</p><p className="draft-note">Nuestra historia, contada por quienes la hacen posible, estará aquí muy pronto.</p><a href="#ubicacion" className="text-link">Encuéntranos <span aria-hidden="true">↗</span></a></div>
      </section>
      <section id="ubicacion" className="visit-section section-space"><div className="page-width"><div className="section-heading"><div><p className="eyebrow">NOS VEMOS EN CUENCA</p><h2>GUÁRDANOS<br /><span>UN LUGAR.</span></h2></div><p className="section-description">Estamos preparando todos los detalles<br />para tu próxima visita.</p></div><div className="visit-grid">
        <div><span className="visit-number">01 / UBICACIÓN</span><h3>Cuenca, Ecuador</h3><p>Dirección y mapa oficial por confirmar.</p></div>
        <div><span className="visit-number">02 / HORARIOS</span><h3>Muy pronto</h3><p>Horarios de atención por confirmar.</p></div>
        <div><span className="visit-number">03 / PEDIDOS</span><h3>Hablemos de antojos</h3><p>WhatsApp y canal de pedidos por confirmar.</p><button className="text-link" onClick={() => openOrder()}>Información de pedidos <span aria-hidden="true">↗</span></button></div>
      </div></div></section>
    </main>
    <footer className="site-footer page-width"><a href="#inicio" className="footer-brand">AJITATE<span>✳</span></a><p>Tex-mex, familia y sabor.<br /><span className="draft-note">Redes oficiales próximamente.</span></p><a className="text-link" href="#inicio">Volver arriba ↑</a></footer>
    <dialog ref={dialog} className="order-dialog" aria-labelledby="order-title" aria-describedby="order-description" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }}>
      <div className="dialog-content"><button className="dialog-close" aria-label="Cerrar" onClick={() => dialog.current?.close()}>×</button><p className="eyebrow">PEDIDOS AJITATE</p><h2 id="order-title">MUY PRONTO.</h2><p id="order-description">{selectedDish ? `¿Se te antoja ${selectedDish}? ` : ''}Estamos preparando el canal oficial de pedidos. El menú y los precios todavía están por confirmar.</p><p className="draft-note">Por ahora no recibimos pedidos desde esta página.</p><button className="button button-red" onClick={() => dialog.current?.close()}>Seguir explorando <span aria-hidden="true">↗</span></button></div>
    </dialog>
  </>
}
