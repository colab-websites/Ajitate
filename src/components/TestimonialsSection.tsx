import { useState, useEffect, useRef, useCallback } from 'react'

const REVIEWS = [
  {
    name: 'Nicole Cajamarca',
    text: 'La comida es muy rica, les recomiendo la hamburguesa bacon smash. La atención es buena y rápida.',
    detail: 'Lo único a tomar en cuenta es que no aceptan tarjeta. Solo efectivo o transferencia.',
    stars: 5,
    meta: '6 opiniones · 7 fotos',
    time: 'Hace 5 meses',
    price: '$5-10',
    badge: null,
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
  },
  {
    name: 'Mery Jaramillo',
    text: 'Las hamburguesas estaban exquisitas y sabrosas. Una marmelada bbq de cebolla caramelizada fuera de este mundo.',
    detail: 'El chef mezcla muy bien los sabores.',
    stars: 5,
    meta: '6 opiniones',
    time: 'Hace un mes',
    price: '$1-5',
    badge: null,
  },
  {
    name: 'Iván Rosero',
    text: 'Las hamburguesas deben ser de las mejores de la ciudad.',
    detail: 'Las papas dejan mucho que desear. Si pides sin combo está bien.',
    stars: 4,
    meta: '14 opiniones · 3 fotos',
    time: 'Hace 3 meses',
    price: '$5-10',
    badge: 'Local Guide',
  },
]

const CARD_W = 420
const CARD_GAP = 160
const ROTATION = 12

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-[3px]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < count ? '#e53935' : 'rgba(255,255,255,0.06)'}>
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.69l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const total = REVIEWS.length

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

  const goNext = useCallback(() => {
    setActive(p => (p + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setActive(p => (p - 1 + total) % total)
  }, [total])

  // Auto-advance
  useEffect(() => {
    if (!revealed || isPaused) return
    timerRef.current = setTimeout(goNext, 4000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, revealed, isPaused, goNext])

  // Keyboard
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [goNext, goPrev])

  const getCardStyle = (index: number) => {
    let offset = index - active
    if (offset > total / 2) offset -= total
    if (offset < -total / 2) offset += total

    const absOffset = Math.abs(offset)
    const isActive = offset === 0
    const isVisible = absOffset <= 2

    return {
      transform: `translateX(${offset * CARD_GAP}px) rotateY(${offset * ROTATION}deg) scale(${isActive ? 1 : 0.88 - absOffset * 0.04})`,
      zIndex: isActive ? 20 : 10 - absOffset,
      opacity: isVisible ? (isActive ? 1 : 0.55 - absOffset * 0.12) : 0,
                    pointerEvents: (isActive ? 'auto' : 'none') as 'auto' | 'none',
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ═══ BACKGROUND ELEMENTS ═══ */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(10rem, 22vw, 28rem)',
          lineHeight: 0.85,
          color: 'rgba(255,255,255,0.01)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 2s ease 0.3s',
        }}
      >
        REVIEWS
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(600px 400px at 50% 50%, rgba(229,57,53,0.03), transparent 60%)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      />

      {/* Decorative lines */}
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          top: '20%',
          left: 40,
          width: 1,
          height: 100,
          background: 'linear-gradient(to bottom, rgba(229,57,53,0.12), transparent)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 0.5s',
        }}
      />
      <div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          bottom: '20%',
          right: 40,
          width: 1,
          height: 80,
          background: 'linear-gradient(to top, rgba(229,57,53,0.08), transparent)',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1.5s ease 0.7s',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24 lg:py-32">
        {/* ── HEADER ── */}
        <div className="text-center mb-16">
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

          {/* Google badge */}
          <div
            className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.05)',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.7s ease 0.6s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-white text-sm font-semibold">4.8</span>
            <StarRow count={5} />
            <span className="text-white/25 text-[9px]">Google Reviews</span>
          </div>

          <div
            className="mt-6 mx-auto h-[1px] max-w-md"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(229,57,53,0.25), transparent)',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 1s ease 0.5s',
            }}
          />
        </div>

        {/* ── 3D CAROUSEL ── */}
        <div
          className="relative mx-auto"
          style={{
            perspective: '1200px',
            height: 380,
            maxWidth: `${CARD_W + CARD_GAP * 4}px`,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {REVIEWS.map((review, i) => {
              const style = getCardStyle(i)
              const isActive = ((i - active + total) % total) === 0 || ((i - active) === 0)

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: CARD_W,
                    ...style,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease, z-index 0s',
                  }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden h-full"
                    style={{
                      background: isActive
                        ? 'linear-gradient(155deg, rgba(229,57,53,0.06), rgba(255,255,255,0.02), rgba(10,10,10,0.97))'
                        : 'linear-gradient(155deg, rgba(255,255,255,0.03), rgba(255,255,255,0.006), rgba(10,10,10,0.98))',
                      border: isActive
                        ? '1px solid rgba(229,57,53,0.18)'
                        : '1px solid rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: isActive
                        ? '0 32px 64px -16px rgba(0,0,0,0.5), 0 0 48px rgba(229,57,53,0.06)'
                        : '0 8px 24px -8px rgba(0,0,0,0.3)',
                      padding: '2rem',
                    }}
                  >
                    {/* Floating quote mark */}
                    <div
                      className="absolute -top-1 -left-1 pointer-events-none select-none"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '5rem',
                        lineHeight: 1,
                        color: isActive ? 'rgba(229,57,53,0.08)' : 'rgba(255,255,255,0.02)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      &ldquo;
                    </div>

                    {/* Top row: stars + price */}
                    <div className="flex items-center justify-between mb-5 relative">
                      <StarRow count={review.stars} />
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          color: 'rgba(255,255,255,0.25)',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        {review.price}
                      </span>
                    </div>

                    {/* Review text */}
                    <p
                      className="leading-[1.75] mb-3 relative"
                      style={{
                        color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.4)',
                        fontSize: 'clamp(0.88rem, 1.2vw, 0.98rem)',
                        fontFamily: 'var(--font-sans)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      {review.text}
                    </p>

                    {/* Detail */}
                    {review.detail && (
                      <p
                        className="leading-[1.6] mb-4 italic relative"
                        style={{
                          color: 'rgba(229,57,53,0.35)',
                          fontSize: '0.82rem',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {review.detail}
                      </p>
                    )}

                    {/* Divider */}
                    <div
                      className="my-5 h-[1px] relative"
                      style={{
                        background: isActive
                          ? 'linear-gradient(90deg, rgba(229,57,53,0.2), transparent)'
                          : 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)',
                        transition: 'background 0.5s ease',
                      }}
                    />

                    {/* Author */}
                    <div className="flex items-center justify-between relative">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            background: isActive
                              ? 'linear-gradient(135deg, rgba(229,57,53,0.18), rgba(229,57,53,0.05))'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))',
                            border: isActive
                              ? '1.5px solid rgba(229,57,53,0.22)'
                              : '1.5px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.5s ease',
                          }}
                        >
                          <span
                            className="text-[11px] font-bold"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: isActive ? '#e53935' : 'rgba(255,255,255,0.25)',
                              transition: 'color 0.5s ease',
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
                                  border: '1px solid rgba(229,57,53,0.1)',
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
                </div>
              )
            })}
          </div>
        </div>

        {/* ── NAVIGATION ── */}
        <div
          className="flex items-center justify-center gap-4 mt-10"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.7s ease 0.8s',
          }}
        >
          {/* Prev */}
          <button
            onClick={goPrev}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(229,57,53,0.12)'
              e.currentTarget.style.borderColor = 'rgba(229,57,53,0.25)'
              e.currentTarget.style.color = '#e53935'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="transition-all duration-500"
                style={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  borderRadius: 9999,
                  background: i === active ? '#e53935' : 'rgba(255,255,255,0.1)',
                  border: i === active ? '1px solid rgba(229,57,53,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: i === active ? '0 0 12px rgba(229,57,53,0.3)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(229,57,53,0.12)'
              e.currentTarget.style.borderColor = 'rgba(229,57,53,0.25)'
              e.currentTarget.style.color = '#e53935'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Active review counter */}
        <div
          className="text-center mt-4"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.7s ease 1s',
          }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-display)' }}
          >
            {active + 1} / {total}
          </span>
        </div>
      </div>

      {/* ── DRAG OVERLAY ── */}
      <div
        className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
        style={{ pointerEvents: isDragging ? 'auto' : 'none' }}
        onMouseDown={e => { setIsDragging(true); dragStart.current = e.clientX }}
        onMouseUp={e => {
          if (!isDragging) return
          const diff = e.clientX - dragStart.current
          if (Math.abs(diff) > 50) {
            if (diff > 0) goPrev()
            else goNext()
          }
          setIsDragging(false)
        }}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={e => { setIsDragging(true); dragStart.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (!isDragging) return
          const diff = e.changedTouches[0].clientX - dragStart.current
          if (Math.abs(diff) > 50) {
            if (diff > 0) goPrev()
            else goNext()
          }
          setIsDragging(false)
        }}
      />
    </section>
  )
}
