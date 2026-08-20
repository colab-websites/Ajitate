import { useRef, useState, useEffect, useCallback } from 'react'

const TESTIMONIALS = [
  {
    stars: 5,
    text: 'Las mejores hamburguesas que he probado en Cuenca. El ambiente familiar te hace sentir en casa. ¡Volvemos cada semana!',
    name: 'María Fernanda',
    initials: 'MF',
    role: 'Cliente frecuente',
    rotate: -2,
    offsetY: 0,
  },
  {
    stars: 5,
    text: 'El burrito gigante es eso, gigante. Sabor increíble, porciones generosas y el servicio es siempre con una sonrisa.',
    name: 'Carlos Peñafiel',
    initials: 'CP',
    role: 'Con familiar',
    rotate: 1.5,
    offsetY: 24,
  },
  {
    stars: 5,
    text: 'Pide a que te atienda Daniel, el dueño. Se nota que ama lo que hace. La salsa picante es adictiva, ojo.',
    name: 'Ana Lucía Tobar',
    initials: 'AT',
    role: 'Recomendado por amigos',
    rotate: -1,
    offsetY: -8,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={i < count ? '#e53935' : 'rgba(255,255,255,0.08)'}
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.69l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [cardTilts, setCardTilts] = useState(TESTIMONIALS.map(() => ({ x: 0, y: 0 })))

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])

  const onCardMove = useCallback((e: React.MouseEvent, idx: number) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setCardTilts(prev => {
      const next = [...prev]
      next[idx] = { x: (y - 0.5) * -12, y: (x - 0.5) * 12 }
      return next
    })
  }, [])

  const onCardLeave = useCallback((idx: number) => {
    setHoveredCard(null)
    setCardTilts(prev => {
      const next = [...prev]
      next[idx] = { x: 0, y: 0 }
      return next
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: '#0a0a0a' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: revealed ? 1 : 0,
          background: `radial-gradient(800px 600px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.04), transparent 60%)`,
        }}
      />

      {/* Floating dots */}
      {[
        { top: '10%', left: '3%', size: 3, color: 'rgba(229,57,53,0.2)' },
        { top: '25%', right: '5%', size: 2, color: 'rgba(255,255,255,0.06)' },
        { bottom: '15%', left: '7%', size: 2, color: 'rgba(229,57,53,0.15)' },
        { bottom: '30%', right: '4%', size: 3, color: 'rgba(255,255,255,0.04)' },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full story-pulse pointer-events-none"
          style={{
            ...d,
            width: d.size,
            height: d.size,
            background: d.color,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.1s',
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-[0.35em]"
              style={{ color: '#e53935' }}
            >
              Lo que dicen
            </span>
          </div>

          <h2
            className="mt-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 0.95,
              color: 'white',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.25s',
            }}
          >
            LA GENTE <span style={{ color: '#e53935' }}>HABLA</span>
          </h2>

          <div
            className="mt-6 h-[1px] w-20"
            style={{
              background: 'linear-gradient(90deg, #e53935, transparent)',
              transformOrigin: 'left',
              transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.5s',
            }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, i) => {
            const tilt = cardTilts[i]
            const isHovered = hoveredCard === i
            return (
              <div
                key={i}
                style={{
                  perspective: '1000px',
                  opacity: revealed ? 1 : 0,
                  transform: revealed
                    ? `translateY(${t.offsetY}px) rotate(${t.rotate}deg)`
                    : `translateY(60px) rotate(${t.rotate}deg)`,
                  transition: `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${0.4 + i * 0.15}s`,
                }}
              >
                <div
                  onMouseMove={(e) => { setHoveredCard(i); onCardMove(e, i) }}
                  onMouseLeave={() => onCardLeave(i)}
                  className="relative rounded-2xl p-7 h-full cursor-default"
                  style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease, border-color 0.4s ease',
                    background: isHovered
                      ? 'linear-gradient(145deg, rgba(229,57,53,0.06), rgba(255,255,255,0.02))'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008))',
                    border: isHovered
                      ? '1px solid rgba(229,57,53,0.2)'
                      : '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isHovered
                      ? '0 24px 48px -12px rgba(0,0,0,0.4), 0 0 40px rgba(229,57,53,0.06)'
                      : '0 8px 24px -8px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Red glow dot */}
                  <div
                    className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full transition-opacity duration-500"
                    style={{
                      background: '#e53935',
                      boxShadow: '0 0 12px rgba(229,57,53,0.4)',
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Stars */}
                  <div className="mb-5">
                    <Stars count={t.stars} />
                  </div>

                  {/* Quote */}
                  <p
                    className="leading-[1.7] mb-6"
                    style={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {t.text}
                  </p>

                  {/* Client */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(229,57,53,0.15), rgba(229,57,53,0.05))',
                        border: '1.5px solid rgba(229,57,53,0.2)',
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: '#e53935' }}
                      >
                        {t.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-white/30 text-[10px]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
