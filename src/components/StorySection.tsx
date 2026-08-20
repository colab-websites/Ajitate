import { useRef, useState, useEffect } from 'react'

const STORY_IMAGE =
  'https://res.cloudinary.com/dklycgquj/image/upload/v1787201076/historia_u5skcx.jpg'

const STORY_LINES = [
  { text: 'Todo empezó con', style: 'normal' as const },
  { text: 'un hambre diferente.', style: 'accent' as const },
  { text: '', style: 'break' as const },
  { text: 'Daniel Bojorque soñaba con un lugar', style: 'normal' as const },
  { text: 'donde la familia se reuniera', style: 'normal' as const },
  { text: 'alrededor de una buena mesa.', style: 'normal' as const },
  { text: '', style: 'break' as const },
  { text: 'Así nació Ajitate:', style: 'bold' as const },
  { text: 'tex-mex con alma en Cuenca.', style: 'accent' as const },
]

export function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return
      const rect = imageRef.current.getBoundingClientRect()
      const viewH = window.innerHeight
      const progress = 1 - (rect.top + rect.height) / (viewH + rect.height)
      setParallaxY((progress - 0.5) * 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
    setTilt({ x: (y - 0.5) * -8, y: (x - 0.5) * 8 })
  }

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setMousePos({ x: 0.5, y: 0.5 })
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 lg:px-16 overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(1000px 800px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.04), transparent 60%)`,
        }}
      />

      {/* Floating glass shards */}
      <div
        className="absolute top-16 left-[6%] w-24 h-36 rounded-2xl pointer-events-none story-glass-shard"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
          border: '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(2px)',
          animationDelay: '0s',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      />
      <div
        className="absolute bottom-20 right-[8%] w-16 h-24 rounded-xl pointer-events-none story-glass-shard-reverse"
        style={{
          background: 'linear-gradient(225deg, rgba(229,57,53,0.04), rgba(229,57,53,0.005))',
          border: '1px solid rgba(229,57,53,0.05)',
          backdropFilter: 'blur(2px)',
          animationDelay: '1.5s',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1.2s ease 0.3s',
        }}
      />
      <div
        className="absolute top-[35%] right-[4%] w-10 h-10 rounded-full pointer-events-none story-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(229,57,53,0.12), transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute bottom-[30%] left-[12%] w-3 h-3 rounded-full pointer-events-none story-float"
        style={{
          background: 'rgba(229,57,53,0.15)',
          animationDelay: '0.5s',
        }}
      />
      <div
        className="absolute top-[60%] right-[20%] w-2 h-2 rounded-full pointer-events-none story-pulse"
        style={{
          background: 'rgba(255,255,255,0.1)',
          animationDelay: '3s',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <div
          className={`mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#e53935' }}
          >
            Nuestra Historia
          </span>
          <div
            className="mt-3 h-[2px] w-16 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #e53935, rgba(229,57,53,0.2))',
            }}
          />
        </div>

        {/* Main card */}
        <div style={{ perspective: '1400px' }}>
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative flex flex-col lg:flex-row rounded-[28px] overflow-hidden cursor-default"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              boxShadow: isVisible
                ? '0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)'
                : 'none',
              background: 'linear-gradient(145deg, #111 0%, #0d0d0d 100%)',
            }}
          >
            {/* ── Left: Image with parallax depth ── */}
            <div
              ref={imageRef}
              className="relative w-full lg:w-[45%] h-[400px] lg:h-[600px] overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Base image with parallax */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${STORY_IMAGE})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'left center',
                  transform: `translateY(${parallaxY}px) scale(1.15)`,
                  transition: 'transform 0.3s ease-out',
                }}
              />

              {/* Depth layer — warm overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(229,57,53,0.08) 0%, rgba(0,0,0,0.3) 50%, rgba(10,10,10,0.8) 100%)',
                }}
              />

              {/* Inner vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at 25% 40%, transparent 20%, rgba(10,10,10,0.7) 80%)',
                }}
              />

              {/* Right fade to card */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 50%, #111 100%)',
                }}
              />

              {/* Bottom fade */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(0deg, #111 0%, transparent 25%)',
                }}
              />

              {/* Glass overlay strip */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{
                  background: 'linear-gradient(0deg, rgba(17,17,17,0.95), transparent)',
                }}
              />
            </div>

            {/* ── Right: Content ── */}
            <div className="relative w-full lg:w-[55%] p-8 lg:p-14 flex flex-col justify-center">
              {/* Animated vertical gold line */}
              <div
                className="absolute left-0 top-10 bottom-10 w-[2px] rounded-full transition-all duration-1000 hidden lg:block"
                style={{
                  background:
                    'linear-gradient(to bottom, #e53935, rgba(229,57,53,0.15), transparent)',
                  transformOrigin: 'top',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                }}
              />

              {/* Story text */}
              <div className="space-y-1">
                {STORY_LINES.map((line, i) => {
                  if (line.style === 'break') return <div key={i} className="h-5" />
                  return (
                    <div key={i} className="overflow-hidden">
                      <span
                        className={`block transition-all duration-700 ${
                          isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                        } ${
                          line.style === 'accent'
                            ? 'font-semibold'
                            : line.style === 'bold'
                            ? 'text-white font-bold'
                            : 'text-white/70'
                        }`}
                        style={{
                          fontFamily:
                            line.style === 'accent'
                              ? 'var(--font-display)'
                              : 'var(--font-sans)',
                          fontSize:
                            line.style === 'accent'
                              ? 'clamp(1.6rem, 3.2vw, 2.4rem)'
                              : line.style === 'bold'
                              ? 'clamp(1.1rem, 1.8vw, 1.3rem)'
                              : 'clamp(0.95rem, 1.5vw, 1.1rem)',
                          lineHeight: 1.65,
                          transitionDelay: `${0.2 + i * 0.08}s`,
                          color:
                            line.style === 'accent' ? '#e53935' : undefined,
                        }}
                      >
                        {line.text}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Gold divider */}
              <div
                className={`my-8 h-[1px] transition-all duration-1000 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background:
                    'linear-gradient(90deg, rgba(229,57,53,0.5), rgba(229,57,53,0.08), transparent)',
                  transitionDelay: '0.9s',
                  transformOrigin: 'left',
                }}
              />

              {/* Founder card — glassmorphic */}
              <div
                className={`relative p-5 rounded-2xl transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transitionDelay: '1s',
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Founder avatar ring */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(229,57,53,0.15), rgba(229,57,53,0.05))',
                      border: '2px solid rgba(229,57,53,0.25)',
                      boxShadow: '0 0 20px rgba(229,57,53,0.08)',
                    }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: '#e53935',
                      }}
                    >
                      DB
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      Daniel Bojorque
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      Fundador de Ajitate
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div
                className={`mt-8 flex gap-10 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '1.2s' }}
              >
                {[
                  { num: '2019', label: 'Fundado' },
                  { num: '5K+', label: 'Clientes felices' },
                  { num: 'Cuenca', label: 'Ecuador' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-xl font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: '#e53935',
                      }}
                    >
                      {stat.num}
                    </p>
                    <p className="text-white/30 text-[11px] uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom quote accent */}
              <div
                className={`mt-10 flex items-center gap-3 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '1.4s' }}
              >
                <div
                  className="w-8 h-[2px] rounded-full"
                  style={{ background: 'rgba(229,57,53,0.3)' }}
                />
                <span
                  className="text-xs italic"
                  style={{
                    color: 'rgba(229,57,53,0.4)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  "La mesa unia a todos"
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
