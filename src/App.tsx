import { useState } from 'react'
import { useIsDesktop } from './hooks/useIsDesktop'
import { DesktopHero } from './components/DesktopHero'
import { DesktopNavbar } from './components/DesktopNavbar'
import { MobileHero } from './components/MobileHero'
import { RestaurantMenu } from './components/RestaurantMenu'
import { OrderDrawer } from './components/OrderDrawer'
import { StorySection } from './components/StorySection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './icons/Icons'

export default function App() {
  const isDesktop = useIsDesktop()
  const [request,setRequest]=useState({serial:0,id:''})
  const openOrder=(id='')=>setRequest(r=>({serial:r.serial+1,id}))
  return <>
    <a className="skip-link" href="#menu">Saltar al menú</a>
    <DesktopNavbar onOrder={() => openOrder()} />
    <main>
      {isDesktop ? <DesktopHero /> : <MobileHero onOrder={openOrder} />}
      <RestaurantMenu onSelect={openOrder} />
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
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">♨</span><h3>Pedidos</h3><p>Tu próximo antojo empieza aquí.</p><button className="glass-action" onClick={() => openOrder()}>Información de pedidos ↗</button><a className="contact-phone" href="tel:+593983047406">0983047406</a></article>
          </div>
          <div id="redes" className="social-placeholder liquid-panel">
            <div><p className="section-kicker">SIGAMOS EN CONTACTO</p><h3>Más sabor, todos los días.</h3><a className="contact-phone" href="https://www.instagram.com/ajitate.ec/" target="_blank" rel="noreferrer">Instagram · @ajitate.ec ↗</a><p>Cuenta publicada en el menú. Facebook y YouTube por confirmar.</p></div>
            <div className="social-preview" aria-hidden="true"><InstagramIcon /><FacebookIcon /><YoutubeIcon /></div>
          </div>
        </div>
      </section>
    </main>
    <footer className="original-footer"><a href="#inicio">AJITATE</a><p>TEX-MEX EN CUENCA · FAMILIA Y SABOR</p><a href="#inicio" aria-label="Volver al inicio">Volver arriba ↑</a></footer>
    <OrderDrawer request={request} />
  </>
}
