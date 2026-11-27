import { useEffect, useState } from 'react'
import { BrandLogo } from './components/BrandLogo'
import { FeaturedHero } from './components/FeaturedHero'
import { DesktopNavbar } from './components/DesktopNavbar'
import { RestaurantMenu } from './components/RestaurantMenu'
import { OrderDrawer } from './components/OrderDrawer'
import { StorySection } from './components/StorySection'
import { MomentsGallery } from './components/MomentsGallery'
import { TestimonialsSection } from './components/TestimonialsSection'
import { VisitSection } from './components/VisitSection'
import './site.css'

export default function App() {
  const [request, setRequest] = useState({ serial: 0, id: '', quick: false })
  const openOrder = (id = '', quick = false) => setRequest(previous => ({ serial: previous.serial + 1, id, quick }))

  useEffect(() => {
    const openFromLink = () => {
      if (window.location.hash === '#pedido') {
        setRequest(previous => ({ serial: previous.serial + 1, id: '', quick: false }))
      }
    }
    openFromLink()
    window.addEventListener('hashchange', openFromLink)
    return () => window.removeEventListener('hashchange', openFromLink)
  }, [])
  return <>
    <a className="skip-link" href="#menu">Saltar al menú</a>
    <DesktopNavbar onOrder={() => openOrder()} />
    <main>
      <FeaturedHero onSelect={openOrder} />
      <RestaurantMenu onSelect={openOrder} onQuickAdd={id => openOrder(id, true)} />
      <div id="nosotros"><StorySection /></div>
      <MomentsGallery />
      <TestimonialsSection />
      <VisitSection onOrder={() => openOrder()} />
    </main>
    <footer className="site-footer"><div className="footer-inner">
      <a className="footer-home" href="#inicio" aria-label="Ajitate, inicio"><BrandLogo /></a>
      <p>Ajitate Minibistro <span>·</span> Cuenca, Ecuador</p>
      <a className="footer-up" href="#inicio">Volver arriba <span aria-hidden="true">↑</span></a>
    </div></footer>
    <OrderDrawer request={request} />
  </>
}
