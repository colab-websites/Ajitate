import { useRef, useState, useEffect, useCallback } from 'react'

const STORY_IMAGE =
  'https://res.cloudinary.com/dklycgquj/image/upload/v1787201076/historia_u5skcx.jpg'

const STORY_PIECES = [
  { type: 'label' as const, delay: 0 },
  { type: 'headline' as const, delay: 150 },
  { type: 'divider' as const, delay: 400 },
  { type: 'body' as const, delay: 500, text: 'Todo empezó con un hambre diferente. Daniel Bojorque soñaba con un lugar donde la familia se reuniera alrededor de una buena mesa.' },
  { type: 'quote' as const, delay: 700, text: '"La mesa une a todos"' },
  { type: 'founder' as const, delay: 900 },
  { type: 'stats' as const, delay: 1100 },
]

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect() } },
      { threshold: 0.15 }
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
      style={{ background: '#0a0a0a' }}
    >
      {/* ═══ AMBIENT GLOW ═══ */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[2000ms]"
        style={{
          opacity: revealed ? 1 : 0,
          background: `radial-gradient(900px 700px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.05), transparent 65%)`,
        }}
      />

      {/* ═══ FLOATING SHARDS ═══ */}
      {[
        { top: '8%', left: '5%', w: 100, h: 160, rotate: 12, delay: '0.6s' },
        { top: '15%', right: '4%', w: 60, h: 90, rotate: -8, delay: '1.2s' },
        { bottom: '12%', left: '8%', w: 40, h: 60, rotate: 20, delay: '1.8s' },
        { bottom: '20%', right: '7%', w: 80, h: 50, rotate: -15, delay: '0.9s' },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none story-glass-shard"
          style={{
            top: s.top, bottom: s.bottom, left: s.left, right: s.right,
            width: s.w, height: s.h,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.003))',
            border: '1px solid rgba(255,255,255,0.035)',
            backdropFilter: 'blur(2px)',
            transform: `rotate(${s.rotate}deg)`,
            animationDelay: s.delay,
            opacity: revealed ? 1 : 0,
            transition: `opacity 1.5s ease ${s.delay}`,
          }}
        />
      ))}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 items-start">

          {/* ── LEFT: Image column ── */}
          <div className="w-full lg:w-[42%] relative">
            {/* Diagonal clip reveal */}
            <div
              className="relative rounded-[24px] overflow-hidden"
              style={{
                aspectRatio: '3/4',
                clipPath: revealed
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                  : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                transition: 'clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1) 0.2s',
              }}
            >
              {/* Image */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${STORY_IMAGE})`,
                  backgroundSize: 'cover',
                  backgroundPosition: '25% 30%',
                  transform: revealed ? 'scale(1)' : 'scale(1.15)',
                  transition: 'transform 2s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
                }}
              />

              {/* Color wash */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(160deg, rgba(229,57,53,0.15) 0%, transparent 40%, rgba(10,10,10,0.5) 100%)',
                }}
              />

              {/* Vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 30% 35%, transparent 15%, rgba(10,10,10,0.55) 85%)',
                }}
              />

              {/* Mouse light */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(400px 350px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.08), transparent 60%)`,
                }}
              />
            </div>

            {/* Floating year tag */}
            <div
              className="absolute -bottom-5 -right-3 lg:right-[-30px] z-20"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(3deg)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 1s',
              }}
            >
              <div
                className="px-5 py-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #e53935, #c62828)',
                  boxShadow: '0 8px 32px rgba(229,57,53,0.35), 0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  className="text-white text-2xl font-bold block leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  2019
                </span>
                <span className="text-white/70 text-[9px] uppercase tracking-widest">
                  Fundado
                </span>
              </div>
            </div>

            {/* Red accent dot */}
            <div
              className="absolute -top-3 -left-3 w-4 h-4 rounded-full z-20 story-pulse"
              style={{
                background: '#e53935',
                boxShadow: '0 0 20px rgba(229,57,53,0.4)',
                opacity: revealed ? 1 : 0,
                transition: 'opacity 1s ease 1.2s',
              }}
            />
          </div>

          {/* ── RIGHT: Content column ── */}
          <div className="w-full lg:w-[58%] lg:pl-16 flex flex-col justify-center">

            {/* Label */}
            <div
              className="mb-4"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
              }}
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
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
                lineHeight: 0.92,
                color: 'white',
                letterSpacing: '-0.01em',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.45s',
              }}
            >
              <span className="block">EL SABOR</span>
              <span className="block" style={{ color: '#e53935' }}>QUE NACE</span>
              <span
                className="block"
                style={{
                  fontSize: '0.42em',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.12em',
                  marginTop: 8,
                }}
              >
                DE LA FAMILIA
              </span>
            </h2>

            {/* Divider */}
            <div
              className="my-8 h-[1px] w-full max-w-[280px]"
              style={{
                background: 'linear-gradient(90deg, #e53935, rgba(229,57,53,0.1), transparent)',
                transformOrigin: 'left',
                transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.7s',
              }}
            />

            {/* Body text */}
            <p
              className="max-w-md leading-[1.75]"
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
                fontFamily: 'var(--font-sans)',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.85s',
              }}
            >
              Todo empezó con un hambre diferente. Daniel Bojorque soñaba con un lugar
              donde la familia se reuniera alrededor de una buena mesa. Así nació Ajitate:
              tex-mex con alma en Cuenca.
            </p>

            {/* Quote */}
            <div
              className="mt-8 flex items-center gap-4"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 1.1s',
              }}
            >
              <div className="w-10 h-[2px] rounded-full" style={{ background: 'rgba(229,57,53,0.4)' }} />
              <span
                className="italic text-sm"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}
              >
                "La mesa une a todos"
              </span>
            </div>

            {/* Founder badge */}
            <div
              className="mt-8 flex items-center gap-4"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 1.3s',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(229,57,53,0.15), rgba(229,57,53,0.04))',
                  border: '1.5px solid rgba(229,57,53,0.25)',
                  boxShadow: '0 0 24px rgba(229,57,53,0.1)',
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

            {/* Stats row */}
            <div
              className="mt-10 flex gap-10"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(16px)',
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 1.5s',
              }}
            >
              {[
                { num: '5K+', label: 'Clientes felices' },
                { num: '100%', label: 'Tex-Mex real' },
                { num: 'Cuenca', label: 'Ecuador' },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: '#e53935' }}
                  >
                    {s.num}
                  </p>
                  <p className="text-white/25 text-[10px] uppercase tracking-wider mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
