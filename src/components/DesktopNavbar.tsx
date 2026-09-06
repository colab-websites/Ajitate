import { useEffect, useState } from 'react'
import { BrandLogo } from './BrandLogo'
import { CartIcon } from '../icons/Icons'

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
    <a className="floating-logo" href="#inicio" aria-label="Ajitate, inicio"><BrandLogo className="brand-full"/><BrandLogo circle className="brand-circle"/></a>
    <nav className="floating-nav liquid-panel" aria-label="Navegación principal">{NAV_ITEMS.map(([label,id]) => <a key={id} href={`#${id}`} className={active === id ? 'selected' : ''} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav>
    <div className="floating-actions"><button className="order-cta" onClick={onOrder}><CartIcon className="w-5 h-5" /><span>Pide Aquí!</span></button><button className="mobile-toggle liquid-panel" aria-label={expanded ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={expanded} aria-controls="mobile-nav" onClick={() => setExpanded(!expanded)}>{expanded ? '×' : '☰'}</button></div>
    {expanded && <nav id="mobile-nav" className="mobile-dropdown liquid-panel" aria-label="Navegación móvil">{NAV_ITEMS.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setExpanded(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav>}
  </header>
}
