import { useRef, useState, useEffect, useCallback } from 'react'

const STORY_IMAGE =
  'https://res.cloudinary.com/dklycgquj/image/upload/v1787201076/historia_u5skcx.jpg'

const TIMELINE = [
  {
    year: '2019',
    title: 'El Sueño',
    body: 'Daniel Bojorque soñaba con un lugar donde la familia se reuniera alrededor de una buena mesa.',
  },
  {
    year: '2020',
    title: 'La Cocina',
    body: 'Las primeras hamburguesas Tex-Mex nacieron en una cocina pequeña, pero con un sabor enorme.',
  },
  {
    year: 'Hoy',
    title: 'La Familia',
    body: 'Ajitate es hoy el punto de encuentro de Cuenca: risas, familia y el mejor sabor tex-mex.',
  },
]

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [imageVisible, setImageVisible] = useState(false)
  const [activeNode, setActiveNode] = useState(-1)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setImageVisible(true)
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const raw = 1 - (rect.top + rect.height) / (viewH + rect.height)
      const clamped = Math.max(0, Math.min(1, raw))
      setScrollProgress(clamped)
      if (clamped > 0.15 && clamped < 0.45) setActiveNode(0)
      else if (clamped >= 0.45 && clamped < 0.75) setActiveNode(1)
      else if (clamped >= 0.75) setActiveNode(2)
      else setActiveNode(-1)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [])

  const parallaxY = (scrollProgress - 0.5) * 60
  const imageScale = 1.2 + scrollProgress * 0.05
  const diagonalShift = scrollProgress * 8

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden"
      style={{ background: '#0a0a0a', minHeight: '200vh' }}
    >
      {/* ── FILM GRAIN OVERLAY ── */}
      <div
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── FLOATING PARTICLES ── */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full story-particle"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            background: i % 4 === 0 ? 'rgba(229,57,53,0.25)' : 'rgba(255,255,255,0.08)',
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${12 + (i * 13) % 75}%`,
            animationDuration: `${5 + (i % 4) * 2}s`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}

      {/* ── STICKY CONTAINER ── */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── FULL-BLEED IMAGE ── */}
        <div
          ref={imageContainerRef}
          className="absolute inset-0"
          style={{ clipPath: `polygon(${diagonalShift}% 0, 100% 0, 100% 100%, ${diagonalShift - 5}% 100%)` }}
        >
          {/* Base image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${STORY_IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: '30% center',
              transform: `translateY(${parallaxY}px) scale(${imageScale})`,
              transition: 'transform 0.15s ease-out',
              filter: imageVisible ? 'none' : 'scale(1.3) blur(8px)',
              opacity: imageVisible ? 1 : 0,
              transitionProperty: 'transform, filter, opacity',
              transitionDuration: '1.2s, 1.5s, 1s',
              transitionTimingFunction: 'ease-out',
            }}
          />

          {/* Diagonal color wash */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${135 + diagonalShift}deg, rgba(229,57,53,0.12) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)`,
            }}
          />

          {/* Mouse-following light beam */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(600px 500px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.06), transparent 60%)`,
              transition: 'background 0.3s ease',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 40% 50%, transparent 20%, rgba(10,10,10,0.6) 80%)',
            }}
          />

          {/* Left edge dissolve */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 15%, transparent 40%)',
            }}
          />

          {/* Right edge dissolve */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(270deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 30%, transparent 60%)',
            }}
          />

          {/* Bottom dissolve */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(0deg, #0a0a0a 0%, rgba(10,10,10,0.6) 20%, transparent 50%)',
            }}
          />
        </div>

        {/* ── DIAGONAL EDGE LINE ── */}
        <div
          className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-10"
          style={{
            left: `calc(${diagonalShift}% + 20px)`,
            background: 'linear-gradient(to bottom, transparent 5%, rgba(229,57,53,0.4) 30%, rgba(229,57,53,0.15) 70%, transparent 95%)',
            transform: 'skewX(-4deg)',
            opacity: imageVisible ? 1 : 0,
            transition: 'opacity 1.5s ease 0.5s',
          }}
        />

        {/* ── VERTICAL TIMELINE (left) ── */}
        <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-0">
          {/* Timeline line */}
          <div
            className="absolute top-0 bottom-0 w-[1px]"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)',
            }}
          />
          {/* Progress line */}
          <div
            className="absolute top-0 w-[1px] transition-all duration-500"
            style={{
              height: `${scrollProgress * 100}%`,
              background: 'linear-gradient(to bottom, rgba(229,57,53,0.6), rgba(229,57,53,0.2))',
            }}
          />

          {TIMELINE.map((_, i) => {
            const isActive = activeNode >= i
            return (
              <div
                key={i}
                className="relative flex items-center justify-center"
                style={{ height: 100 }}
              >
                <div
                  className="relative z-10 rounded-full transition-all duration-500"
                  style={{
                    width: isActive ? 14 : 8,
                    height: isActive ? 14 : 8,
                    background: isActive ? '#e53935' : 'rgba(255,255,255,0.15)',
                    boxShadow: isActive
                      ? '0 0 16px rgba(229,57,53,0.5), 0 0 32px rgba(229,57,53,0.2)'
                      : 'none',
                    border: isActive ? '2px solid rgba(229,57,53,0.3)' : '2px solid rgba(255,255,255,0.08)',
                  }}
                />
                {/* Year label */}
                <span
                  className="absolute left-8 whitespace-nowrap text-xs font-semibold uppercase tracking-widest transition-all duration-500"
                  style={{
                    color: isActive ? '#e53935' : 'rgba(255,255,255,0.2)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                  }}
                >
                  {TIMELINE[i].year}
                </span>
              </div>
            )
          })}
        </div>

        {/* ── CONTENT OVERLAY ── */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 lg:gap-8">

            {/* ── LEFT: Big title ── */}
            <div className="flex-1 max-w-xl">
              {/* Section label */}
              <div
                className={`mb-6 transition-all duration-700 ${imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-[0.35em]"
                  style={{ color: '#e53935' }}
                >
                  Nuestra Historia
                </span>
              </div>

              {/* Giant headline */}
              <h2
                className={`transition-all duration-1000 ${imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  lineHeight: 0.9,
                  color: 'white',
                  letterSpacing: '-0.02em',
                  transitionDelay: '0.2s',
                }}
              >
                <span className="block">UN SABOR</span>
                <span className="block" style={{ color: '#e53935' }}>QUE NACE</span>
                <span className="block text-white/40" style={{ fontSize: '0.55em', letterSpacing: '0.08em' }}>
                  DE LA FAMILIA
                </span>
              </h2>

              {/* Decorative line */}
              <div
                className={`mt-8 transition-all duration-1000 ${imageVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '0.6s' }}
              >
                <div
                  className="h-[1px] w-24"
                  style={{
                    background: 'linear-gradient(90deg, #e53935, transparent)',
                    transformOrigin: 'left',
                    transform: imageVisible ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.8s',
                  }}
                />
              </div>
            </div>

            {/* ── RIGHT: Glass panels ── */}
            <div className="flex-1 max-w-lg flex flex-col gap-4">
              {TIMELINE.map((item, i) => {
                const isVisible = activeNode >= i
                const isCurrent = activeNode === i
                return (
                  <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden transition-all duration-700"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? 'translateX(0) scale(1)'
                        : 'translateX(40px) scale(0.95)',
                      transitionDelay: `${i * 0.15}s`,
                      background: isCurrent
                        ? 'linear-gradient(135deg, rgba(229,57,53,0.08), rgba(229,57,53,0.02))'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.008))',
                      border: isCurrent
                        ? '1px solid rgba(229,57,53,0.15)'
                        : '1px solid rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(16px)',
                      padding: '1.5rem',
                    }}
                  >
                    {/* Year badge */}
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: isCurrent ? '#e53935' : 'rgba(255,255,255,0.3)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {item.year}
                      </span>
                      <div
                        className="flex-1 h-[1px]"
                        style={{
                          background: isCurrent
                            ? 'linear-gradient(90deg, rgba(229,57,53,0.3), transparent)'
                            : 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)',
                        }}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-white font-semibold mb-1"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Body */}
                    <p
                      className="leading-relaxed"
                      style={{
                        color: isCurrent ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                        fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                )
              })}

              {/* Founder badge */}
              <div
                className={`flex items-center gap-4 mt-2 transition-all duration-700 ${activeNode >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '0.3s' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(229,57,53,0.12), rgba(229,57,53,0.04))',
                    border: '1.5px solid rgba(229,57,53,0.2)',
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: '#e53935' }}
                  >
                    DB
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Daniel Bojorque</p>
                  <p className="text-white/30 text-xs">Fundador de Ajitate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SCROLL HINT ── */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-all duration-700 ${scrollProgress > 0.1 ? 'opacity-0' : 'opacity-100'}`}
        >
          <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-8 bg-white/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-white/40"
              style={{
                animation: 'scroll-hint-line 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
