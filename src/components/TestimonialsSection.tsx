import { useRef, useState, useEffect, useCallback } from 'react'

const REVIEWS = [
  {
    name: 'Nicole Cajamarca',
    text: 'La comida es muy rica, les recomiendo la hamburguesa bacon smash. La atención es buena y rápida.',
    detail: 'Solo aceptan efectivo o transferencia.',
    stars: 5,
    meta: '6 opiniones · 7 fotos',
    time: 'Hace 5 meses',
    price: '$5-10',
    badge: null,
    accent: '#e53935',
    width: 'max-w-[340px]',
  },
  {
    name: 'Daniel Barrera',
    text: 'Excelentes hamburguesas! Un lugar acogedor para volver. Recomendado la pork y la Cerveza Artesanal!',
    detail: '',
    stars: 5,
    meta: '137 opiniones · 1080 fotos',
    time: 'Hace 8 meses',
    price: '$5-10',
    badge: 'Local Guide',
    accent: '#e53935',
    width: 'max-w-[360px]',
  },
  {
    name: 'Diego Ortega',
    text: 'Gratamente sorprendido. Excelente comida, atención amable y oportuna. La mejor relación costo / beneficio que he probado.',
    detail: 'PD: Prueben el pan de papá y me cuentan luego.',
    stars: 5,
    meta: '5 opiniones',
    time: 'Hace 2 meses',
    price: '$5-10',
    badge: 'TECNASA',
    accent: '#e53935',
    width: 'max-w-[380px]',
  },
  {
    name: 'Mery Jaramillo',
    text: 'Las hamburguesas estaban exquisitas y sabrosas. El chef mezcla muy bien los sabores. Una marmelada bbq de cebolla caramelizada fuera de este mundo.',
    detail: '',
    stars: 5,
    meta: '6 opiniones',
    time: 'Hace un mes',
    price: '$1-5',
    badge: null,
    accent: '#e53935',
    width: 'max-w-[350px]',
  },
  {
    name: 'Iván Rosero',
    text: 'Las hamburguesas deben ser de las mejores de la ciudad. Si pides sin combo está bien.',
    detail: 'Las papas dejan mucho que desear.',
    stars: 4,
    meta: '14 opiniones · 3 fotos',
    time: 'Hace 3 meses',
    price: '$5-10',
    badge: 'Local Guide',
    accent: '#e53935',
    width: 'max-w-[320px]',
  },
]

const LAYOUT = [
  { top: '0%', left: '2%', rotate: -1.5, scale: 1 },
  { top: '8%', left: '36%', rotate: 1, scale: 1.02 },
  { top: '38%', left: '8%', rotate: 0.8, scale: 0.98 },
  { top: '32%', left: '58%', rotate: -0.6, scale: 1 },
  { top: '68%', left: '28%', rotate: 1.2, scale: 0.97 },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-[3px]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 20 20" fill={i < count ? '#e53935' : 'rgba(255,255,255,0.06)'}>
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.69l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden"
      style={{ background: '#0a0a0a', minHeight: '100vh' }}
    >
      {/* ═══ GIANT WATERMARK ═══ */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: '10%',
          right: '-5%',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(15rem, 30vw, 35rem)',
          lineHeight: 0.85,
          color: 'rgba(255,255,255,0.012)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 2s ease 0.3s',
        }}
      >
        5★
      </div>

      {/* ═══ AMBIENT GLOW ═══ */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: revealed ? 1 : 0,
          background: `radial-gradient(700px 500px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.035), transparent 55%)`,
        }}
      />

      {/* ═══ DECORATIVE ELEMENTS ═══ */}
      {/* Diagonal line top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          right: '12%',
          width: 120,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(229,57,53,0.2), transparent)',
          transform: 'rotate(-25deg)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 0.8s',
        }}
      />
      {/* Diagonal line bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '12%',
          left: '5%',
          width: 90,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          transform: 'rotate(15deg)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 1s',
        }}
      />
      {/* Triangle */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          right: '8%',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '10px solid rgba(229,57,53,0.08)',
          transform: 'rotate(30deg)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 1.2s',
        }}
      />
      {/* Circle ring */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: '18%',
          right: '15%',
          width: 40,
          height: 40,
          border: '1px solid rgba(255,255,255,0.04)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 0.6s',
        }}
      />
      {/* Small dots */}
      {[
        { top: '8%', left: '15%', size: 3, color: 'rgba(229,57,53,0.15)' },
        { top: '45%', right: '3%', size: 2, color: 'rgba(255,255,255,0.06)' },
        { bottom: '25%', left: '2%', size: 2, color: 'rgba(229,57,53,0.12)' },
        { top: '70%', right: '22%', size: 3, color: 'rgba(255,255,255,0.04)' },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full story-pulse pointer-events-none"
          style={{ ...d, width: d.size, height: d.size, background: d.color, animationDelay: `${i * 1.5}s` }}
        />
      ))}
      {/* Vertical accent line left */}
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          top: '15%',
          left: 48,
          width: 1,
          height: 80,
          background: 'linear-gradient(to bottom, rgba(229,57,53,0.15), transparent)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 0.5s',
        }}
      />
      {/* Vertical accent line right */}
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          bottom: '20%',
          right: 48,
          width: 1,
          height: 60,
          background: 'linear-gradient(to top, rgba(229,57,53,0.1), transparent)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 0.7s',
        }}
      />

      {/* ═══ HEADER ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-24 lg:pt-28 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.1s',
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: '#e53935' }}>
                Reseñas reales
              </span>
            </div>
            <h2
              className="mt-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                lineHeight: 0.95,
                color: 'white',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.25s',
              }}
            >
              LA CALLE <span style={{ color: '#e53935' }}>HABLA</span>
            </h2>
          </div>

          {/* Google rating badge */}
          <div
            className="flex items-center gap-3"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(20px)',
              transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.6s',
            }}
          >
            <div
              className="px-4 py-2.5 rounded-xl flex items-center gap-2.5"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-sm font-semibold">4.8</span>
                  <StarRow count={5} />
                </div>
                <span className="text-white/25 text-[9px]">Google Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-6 h-[1px] w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(229,57,53,0.25), rgba(255,255,255,0.04), transparent)',
            transformOrigin: 'left',
            transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.5s',
          }}
        />
      </div>

      {/* ═══ REVIEWS MASONRY ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pb-24 lg:pb-32">
        <div className="relative" style={{ minHeight: 'clamp(500px, 65vw, 700px)' }}>
          {REVIEWS.map((review, i) => {
            const layout = LAYOUT[i]
            const isHovered = hoveredIdx === i
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: layout.top,
                  left: layout.left,
                  width: 'clamp(280px, 35vw, 400px)',
                  opacity: revealed ? 1 : 0,
                  transform: revealed
                    ? `rotate(${layout.rotate}deg) scale(${layout.scale})`
                    : `rotate(${layout.rotate + 3}deg) scale(${layout.scale - 0.1}) translateY(40px)`,
                  transition: `all 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${0.3 + i * 0.12}s`,
                  zIndex: isHovered ? 30 : 10 + i,
                }}
              >
                <div
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="relative rounded-2xl overflow-hidden cursor-default group"
                  style={{
                    transform: isHovered
                      ? `rotate(${layout.rotate * -0.5}deg) scale(1.04) translateY(-8px)`
                      : `rotate(0deg) scale(1) translateY(0)`,
                    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease',
                    boxShadow: isHovered
                      ? '0 32px 64px -16px rgba(0,0,0,0.5), 0 0 48px rgba(229,57,53,0.08)'
                      : '0 12px 32px -8px rgba(0,0,0,0.35)',
                  }}
                >
                  {/* Card background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isHovered
                        ? 'linear-gradient(155deg, rgba(229,57,53,0.07), rgba(255,255,255,0.025), rgba(10,10,10,0.95))'
                        : 'linear-gradient(155deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008), rgba(10,10,10,0.98))',
                      border: isHovered
                        ? '1px solid rgba(229,57,53,0.2)'
                        : '1px solid rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.5s ease',
                    }}
                  />

                  {/* Red accent line top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${review.accent}, transparent)`,
                      opacity: isHovered ? 0.6 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                  />

                  {/* Floating quote mark */}
                  <div
                    className="absolute -top-2 -left-1 pointer-events-none select-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isHovered ? '6rem' : '4.5rem',
                      lineHeight: 1,
                      color: `rgba(229,57,53,${isHovered ? 0.1 : 0.04})`,
                      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                  >
                    "
                  </div>

                  <div className="relative p-6 pt-8">
                    {/* Stars + price row */}
                    <div className="flex items-center justify-between mb-4">
                      <StarRow count={review.stars} />
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          color: 'rgba(255,255,255,0.3)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        {review.price}
                      </span>
                    </div>

                    {/* Review text */}
                    <p
                      className="leading-[1.7] mb-1"
                      style={{
                        color: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
                        fontSize: 'clamp(0.82rem, 1.1vw, 0.92rem)',
                        fontFamily: 'var(--font-sans)',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      {review.text}
                    </p>

                    {/* Detail (shown on hover) */}
                    {review.detail && (
                      <p
                        className="leading-[1.6] mt-2"
                        style={{
                          color: 'rgba(229,57,53,0.4)',
                          fontSize: '0.8rem',
                          fontStyle: 'italic',
                          fontFamily: 'var(--font-sans)',
                          maxHeight: isHovered ? 60 : 0,
                          opacity: isHovered ? 1 : 0,
                          overflow: 'hidden',
                          transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                        }}
                      >
                        {review.detail}
                      </p>
                    )}

                    {/* Divider */}
                    <div
                      className="my-4 h-[1px]"
                      style={{
                        background: isHovered
                          ? 'linear-gradient(90deg, rgba(229,57,53,0.2), transparent)'
                          : 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)',
                        transition: 'background 0.4s ease',
                      }}
                    />

                    {/* Author row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: isHovered
                              ? 'linear-gradient(135deg, rgba(229,57,53,0.2), rgba(229,57,53,0.06))'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                            border: isHovered
                              ? '1.5px solid rgba(229,57,53,0.25)'
                              : '1.5px solid rgba(255,255,255,0.06)',
                            transition: 'all 0.4s ease',
                          }}
                        >
                          <span
                            className="text-[10px] font-bold"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: isHovered ? '#e53935' : 'rgba(255,255,255,0.3)',
                              transition: 'color 0.4s ease',
                            }}
                          >
                            {review.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white text-xs font-semibold">{review.name}</p>
                            {review.badge && (
                              <span
                                className="text-[8px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
                                style={{
                                  background: 'rgba(229,57,53,0.1)',
                                  color: 'rgba(229,57,53,0.5)',
                                  border: '1px solid rgba(229,57,53,0.12)',
                                }}
                              >
                                {review.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-white/20 text-[9px] mt-0.5">{review.meta}</p>
                        </div>
                      </div>
                      <span className="text-white/15 text-[9px] whitespace-nowrap">{review.time}</span>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      boxShadow: isHovered ? 'inset 0 0 40px rgba(229,57,53,0.04)' : 'none',
                      transition: 'box-shadow 0.5s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
