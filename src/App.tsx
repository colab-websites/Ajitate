import { SOCIALS } from './data/socials'
import { BrandLogo } from './components/BrandLogo'
import { useState } from 'react'
import { useIsDesktop } from './hooks/useIsDesktop'
import { DesktopHero } from './components/DesktopHero'
import { DesktopNavbar } from './components/DesktopNavbar'
import { MobileHero } from './components/MobileHero'
import { RestaurantMenu } from './components/RestaurantMenu'
import { OrderDrawer } from './components/OrderDrawer'
import { StorySection } from './components/StorySection'
import { TestimonialsSection } from './components/TestimonialsSection'

export default function App() {
  const isDesktop = useIsDesktop()
  const [request,setRequest]=useState({serial:0,id:'',quick:false})
  const openOrder=(id='',quick=false)=>setRequest(r=>({serial:r.serial+1,id,quick}))
  return <>
    <a className="skip-link" href="#menu">Saltar al menú</a>
    <DesktopNavbar onOrder={() => openOrder()} />
    <main>
      {isDesktop ? <DesktopHero /> : <MobileHero onOrder={openOrder} />}
      <RestaurantMenu onSelect={id=>openOrder(id)} onQuickAdd={id=>openOrder(id,true)} />
      <div id="nosotros"><StorySection /></div>
      <TestimonialsSection />
      <section id="ubicacion" className="contact-section">
        <div className="contact-glow" aria-hidden="true" />
        <div className="contact-inner">
          <p className="section-kicker">NOS VEMOS EN CUENCA</p>
          <h2>TE GUARDAMOS<br /><span>UN LUGAR</span></h2>
          <p className="contact-intro">La buena comida sabe mejor en buena compañía.</p>
          <div className="contact-grid">
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">↗</span><h3>Ubicación</h3><p>Av. Don Bosco, Cuenca<br />Frente a Sistemas de Escapes Falconi</p><a className="contact-phone" href="https://maps.app.goo.gl/FTVdfzcjXtNxwSw76" target="_blank" rel="noreferrer">Cómo llegar ↗</a></article>
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">◷</span><h3>Horarios</h3><p>Martes a sábado<br />12:00–15:00 · 18:00–22:00</p></article>
            <article className="liquid-panel"><span className="contact-symbol" aria-hidden="true">♨</span><h3>Pedidos</h3><p>Tu próximo antojo empieza aquí.</p><button className="glass-action" onClick={() => openOrder()}>Realiza tu pedido aquí →</button><a className="contact-call" href="tel:+593983047406"><span aria-hidden="true">☎</span><span><small>¿Prefieres llamar?</small><strong>(098) 304-7406</strong></span><span aria-hidden="true">↗</span></a></article>
          </div>
          <div id="redes" className="social-placeholder liquid-panel">
            <div><p className="section-kicker">SIGAMOS EN CONTACTO</p><h3>Más sabor, todos los días.</h3><a className="contact-phone" href="https://www.instagram.com/ajitate.ec/" target="_blank" rel="noreferrer">Instagram · @ajitate.ec ↗</a></div>
            <div className="social-preview">{SOCIALS.map(({name,href,Icon})=><a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}><Icon/></a>)}</div>
          </div>
        </div>
      </section>
    </main>
    <footer className="original-footer expanded-footer"><a className="footer-logo-link" href="#inicio" aria-label="Ajitate, inicio"><BrandLogo className="footer-brand"/></a><p>TEX-MEX EN CUENCA · FAMILIA Y SABOR</p><div className="footer-links"><a href="#menu">Menú</a><a href="#especiales">Especiales</a><a href="#nosotros">Nuestra historia</a><a href="#ubicacion">Visítanos</a></div><div className="footer-bottom"><span>Hecho para compartir una buena mesa.</span><a href="#inicio" aria-label="Volver al inicio">Volver arriba ↑</a></div></footer>
    <OrderDrawer request={request} />
  </>
}
