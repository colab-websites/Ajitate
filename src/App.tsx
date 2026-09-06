import { useRef, useState } from 'react'
import { useIsDesktop } from './hooks/useIsDesktop'
import { DesktopHero } from './components/DesktopHero'
import { DesktopNavbar } from './components/DesktopNavbar'
import { MobileHero } from './components/MobileHero'
import { SpecialtiesMenu } from './components/SpecialtiesMenu'
import { StorySection } from './components/StorySection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './icons/Icons'

export default function App() {
  const isDesktop = useIsDesktop()
  const dialog = useRef<HTMLDialogElement>(null)
  const [dish, setDish] = useState('')
  const openOrder = (name = '') => { setDish(name); dialog.current?.showModal() }
  return <>
    <a className="skip-link" href="#menu">Saltar al menú</a>
    <DesktopNavbar onOrder={() => openOrder()} />
    <main>
      {isDesktop ? <DesktopHero /> : <MobileHero onOrder={openOrder} />}
      <div id="menu"><SpecialtiesMenu onOrder={openOrder} /></div>
      <div id="nosotros"><StorySection /></div>
      <TestimonialsSection />
      <section id="ubicacion" className="contact-section">
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-inner">
          <p className="section-kicker">NOS VEMOS EN CUENCA</p>
          <h2>TE GUARDAMOS<br /><span>UN LUGAR</span></h2>
          <p className="contact-intro">La buena comida sabe mejor en buena compañía.</p>
          <div className="contact-grid">
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">↗</span><h3>Ubicación</h3><p>Cuenca, Ecuador</p><small>Dirección y mapa oficial por confirmar.</small></article>
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">◷</span><h3>Horarios</h3><p>Estamos preparando tu próxima visita.</p><small>Horarios de atención por confirmar.</small></article>
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">♨</span><h3>Pedidos</h3><p>Tu próximo antojo empieza aquí.</p><button className="glass-action" onClick={() => openOrder()}>Información de pedidos ↗</button><small>WhatsApp oficial pendiente.</small></article>
          </div>
          <div id="redes" className="social-placeholder liquid-panel">
            <div><p className="section-kicker">SIGAMOS EN CONTACTO</p><h3>Más sabor, muy pronto.</h3><p>Los enlaces oficiales de Instagram, Facebook y YouTube estarán aquí.</p></div>
            <div className="social-preview" aria-hidden="true"><InstagramIcon /><FacebookIcon /><YoutubeIcon /></div>
          </div>
        </div>
      </section>
    </main>
    <footer className="original-footer"><a href="#inicio">AJITATE</a><p>TEX-MEX EN CUENCA · FAMILIA Y SABOR</p><a href="#inicio" aria-label="Volver al inicio">Volver arriba ↑</a></footer>
    <dialog ref={dialog} className="order-dialog liquid-panel" aria-labelledby="order-title" onClick={e => { if(e.target === e.currentTarget) dialog.current?.close() }}>
      <button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Cerrar">×</button><p className="section-kicker">PEDIDOS AJITATE</p><h2 id="order-title">MUY PRONTO</h2><p>{dish ? `¿Se te antoja ${dish}? ` : ''}Estamos preparando el canal oficial de pedidos.</p><p>El menú y los precios están por confirmar. Por ahora no recibimos pedidos desde esta página.</p><button className="glass-action" onClick={() => dialog.current?.close()}>Seguir explorando ↗</button>
    </dialog>
  </>
}
