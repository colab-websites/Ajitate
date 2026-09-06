import { useEffect, useState } from 'react'
import { CartIcon } from '../icons/Icons'

const LOGO_URL = 'https://res.cloudinary.com/dlsw7vg31/image/upload/v1786686042/AJITATE_LOGO_sin_slogan_f9iqsw.png'
const NAV_ITEMS = [['Inicio', 'inicio'], ['Menú', 'menu'], ['Especiales', 'especiales'], ['Nosotros', 'nosotros'], ['Ubicación', 'ubicacion']]

export function DesktopNavbar({ onOrder }: { onOrder: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('inicio')
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 40)
      const current = [...NAV_ITEMS].reverse().find(([, id]) => {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        return rect && rect.top <= 180
      })
      setActive(current?.[1] ?? 'inicio')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <header className={`floating-header ${scrolled ? 'is-scrolled' : ''}`}>
    <a className="floating-logo" href="#inicio" aria-label="Ajitate, inicio"><img src={LOGO_URL} alt="Ajitate" /></a>
    <nav className="floating-nav liquid-panel" aria-label="Navegación principal">{NAV_ITEMS.map(([label,id]) => <a key={id} href={`#${id}`} className={active === id ? 'selected' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav>
    <div className="floating-actions"><button className="order-cta" onClick={onOrder}><CartIcon className="w-5 h-5" /><span>Pide Aquí!</span><i aria-hidden="true" /></button><button className="mobile-toggle liquid-panel" aria-label={expanded ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={expanded} aria-controls="mobile-nav" onClick={() => setExpanded(!expanded)}>{expanded ? '×' : '☰'}</button></div>
    {expanded && <nav id="mobile-nav" className="mobile-dropdown liquid-panel" aria-label="Navegación móvil">{NAV_ITEMS.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setExpanded(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav>}
  </header>
}
