import { useEffect, useRef, useState } from 'react'
import { BrandLogo } from './BrandLogo'

const links = [['Inicio', 'inicio'], ['Menú', 'menu'], ['Especiales', 'especiales'], ['Nosotros', 'nosotros'], ['Visítanos', 'ubicacion']]
const sectionsFromBottom = [...links].reverse()

export function DesktopNavbar({ onOrder }: { onOrder: () => void }) {
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState('inicio')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const current = sectionsFromBottom.find(([, id]) => {
        const section = document.getElementById(id)
        return section && section.getBoundingClientRect().top <= 148
      })
      setActive(current?.[1] ?? 'inicio')
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (!expanded) return
    const dismiss = (event: PointerEvent | FocusEvent) => { if (!header.current?.contains(event.target as Node)) setExpanded(false) }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') { setExpanded(false); toggle.current?.focus() } }
    const desktop = window.matchMedia('(min-width: 781px)')
    const resize = () => { if (desktop.matches) setExpanded(false) }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('focusin', dismiss)
    document.addEventListener('keydown', escape)
    desktop.addEventListener('change', resize)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('focusin', dismiss); document.removeEventListener('keydown', escape); desktop.removeEventListener('change', resize) }
  }, [expanded])

  return <header className="site-masthead" ref={header}>
    <div className="masthead-inner">
      <a className="masthead-logo" href="#inicio" aria-label="Ajitate, inicio" onClick={() => setExpanded(false)}><BrandLogo /></a>
      <nav className="masthead-nav" aria-label="Navegación principal">{links.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav>
      <div className="masthead-actions"><button className="masthead-order" onClick={() => { setExpanded(false); onOrder() }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></svg>Mi pedido</button>
      <button ref={toggle} className="masthead-toggle" aria-label={expanded ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={expanded} aria-controls="mobile-nav" onClick={() => setExpanded(value => !value)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={expanded ? 'm6 6 12 12M18 6 6 18' : 'M3 7h18M3 12h18M3 17h18'} /></svg></button></div>
      <nav id="mobile-nav" className="masthead-mobile" aria-label="Navegación móvil" hidden={!expanded}>{links.map(([label, id]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setExpanded(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav>
    </div>
  </header>
}
