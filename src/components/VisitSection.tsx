import { useEffect, useState } from 'react'
import { getOpeningStatus, weeklyHours } from '../data/openingHours'
import { SOCIALS } from '../data/socials'
import { CaretDown } from '../icons/Icons'
import './VisitSection.css'

const directionsUrl = 'https://maps.app.goo.gl/FTVdfzcjXtNxwSw76'

function HoursPanel() {
  const [status, setStatus] = useState(() => getOpeningStatus(new Date()))

  useEffect(() => {
    let timer: number
    const refresh = () => {
      window.clearTimeout(timer)
      const now = new Date()
      setStatus(getOpeningStatus(now))
      timer = window.setTimeout(refresh, 60_000 - now.getTime() % 60_000)
    }
    refresh()
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return (
    <div className="visit-hours" aria-labelledby="visit-hours-title">
      <div className="visit-hours-head">
        <h3 id="visit-hours-title">Horarios</h3>
        <span>Hora de Cuenca</span>
      </div>
      <div className="visit-status" role="status">
        <p className="visit-status-line" data-open={status.open}>
          <i aria-hidden="true" />{status.open ? 'Abierto ahora' : 'Cerrado ahora'}
        </p>
        <p>{status.detail}</p>
      </div>
      <details className="visit-schedule">
        <summary>Ver horarios de la semana <CaretDown /></summary>
        <dl>
          {weeklyHours.map(({ day, hours }) => (
            <div key={day} className={day === status.today.day ? 'visit-today' : undefined}>
              <dt>{day}{day === status.today.day && <small>Hoy</small>}</dt>
              <dd>{hours.length ? hours.map(([start, end]) => (
                <span key={start}>{start}:00–{end}:00</span>
              )) : 'Cerrado'}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}

export function VisitSection({ onOrder }: { onOrder: () => void }) {
  return (
    <section id="ubicacion" className="visit-section" aria-labelledby="visit-title">
      <div className="visit-inner">
        <div className="visit-grid">
          <div className="visit-location">
            <p className="section-kicker">Visítanos</p>
            <h2 id="visit-title">Nos vemos<br /><span>en Cuenca.</span></h2>
            <address>
              <strong>Av. Don Bosco, Cuenca</strong>
              <span>Frente a Sistemas de Escapes Falconi</span>
            </address>
            <div className="visit-actions">
              <a className="visit-directions" href={directionsUrl} target="_blank" rel="noreferrer">Cómo llegar <span aria-hidden="true">↗</span></a>
              <a className="visit-phone" href="tel:+593983047406" aria-label="Llamar al (098) 304-7406">(098) 304-7406</a>
            </div>
          </div>
          <HoursPanel />
        </div>
        <div className="visit-bottom">
          <div className="visit-order">
            <h3>¿Pides para llevar?</h3>
            <button type="button" onClick={onOrder}>Armar mi pedido <span aria-hidden="true">→</span></button>
          </div>
          <nav id="redes" className="visit-socials" aria-label="Redes sociales de Ajitate">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name === 'Instagram' ? 'Instagram de Ajitate, @ajitate.ec' : name}>
                <Icon /><span>{name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
