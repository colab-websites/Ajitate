import { useRef, useState, useEffect } from 'react'

const ASSET_BASE =
  'https://pub-36eefd528bbb4e28bdef0ce39a1018e0.r2.dev/Prompt/21-canger-burguer/public/assets'

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
  const [isVisible, setIsVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 10 })
  }

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setMousePos({ x: 0.5, y: 0.5 })
  }

  const depthLayers = [
    { z: 0, scale: 1, opacity: 1, mix: 'normal' as const },
    { z: 30, scale: 1.1, opacity: 0.25, mix: 'screen' as const },
    { z: 60, scale: 1.2, opacity: 0.08, mix: 'overlay' as const },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 lg:px-16 overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Animated background glow that follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: isVisible ? 0.6 : 0,
          background: `radial-gradient(900px 700px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(229,57,53,0.07), transparent 70%)`,
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-12 left-[8%] story-float" style={{ animationDelay: '0s' }}>
        <span className="text-[140px] font-bold text-white/[0.025] leading-none select-none" style={{ fontFamily: 'var(--font-display)' }}>"</span>
      </div>
      <div className="absolute bottom-16 right-[6%] story-float-reverse" style={{ animationDelay: '2s' }}>
        <span className="text-[100px] font-bold text-[#e53935]/[0.05] leading-none select-none" style={{ fontFamily: 'var(--font-display)' }}>"</span>
      </div>
      <div className="absolute top-[30%] right-[12%] story-pulse">
        <div className="w-2 h-2 rounded-full bg-[#e53935]/20" />
      </div>
      <div className="absolute bottom-[25%] left-[18%] story-float" style={{ animationDelay: '3s' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
      </div>
      <div className="absolute top-[60%] right-[25%] story-pulse" style={{ animationDelay: '1.5s' }}>
        <div className="w-1 h-1 rounded-full bg-[#e53935]/15" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <div className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-[#e53935] text-sm font-semibold uppercase tracking-[0.3em]">
            Nuestra Historia
          </span>
          <div className="mt-3 h-[3px] w-16 bg-[#e53935] rounded-full" />
        </div>

        {/* 3D Story Card */}
        <div style={{ perspective: '1200px' }}>
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative flex flex-col lg:flex-row rounded-[32px] overflow-hidden cursor-default"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              boxShadow: isVisible
                ? '0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
                : 'none',
            }}
          >
            {/* ── Left: Image with 3D depth layers ── */}
            <div className="relative w-full lg:w-[48%] h-[420px] lg:h-[560px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
              {depthLayers.map((layer, i) => (
                <div
                  key={i}
                  className="story-card-layer"
                  style={{
                    backgroundImage: `url(${ASSET_BASE}/product-1.png)`,
                    transform: `translateZ(${layer.z}px) scale(${layer.scale})`,
                    opacity: layer.opacity,
                    mixBlendMode: layer.mix,
                    filter: i === 0 ? 'none' : 'blur(1px)',
                  }}
                />
              ))}

              {/* Warm color wash */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(229,57,53,0.18) 0%, rgba(0,0,0,0.5) 100%)',
                }}
              />

              {/* Inner vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(10,10,10,0.85) 100%)',
                }}
              />

              {/* Side vignette for depth */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 60%, rgba(17,17,17,1) 100%)',
                }}
              />
            </div>

            {/* ── Right: Text content ── */}
            <div className="relative w-full lg:w-[52%] bg-[#111] p-8 lg:p-14 flex flex-col justify-center">
              {/* Animated vertical accent line */}
              <div
                className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full transition-all duration-1000"
                style={{
                  background: 'linear-gradient(to bottom, #e53935, rgba(229,57,53,0.3), transparent)',
                  transformOrigin: 'top',
                  transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                }}
              />

              {/* Story text lines */}
              <div className="space-y-0.5">
                {STORY_LINES.map((line, i) => {
                  if (line.style === 'break') {
                    return <div key={i} className="h-4" />
                  }
                  return (
                    <div
                      key={i}
                      className="overflow-hidden"
                    >
                      <span
                        className={`block transition-all duration-700 ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                        } ${
                          line.style === 'accent'
                            ? 'text-[#e53935]'
                            : line.style === 'bold'
                            ? 'text-white font-semibold'
                            : 'text-white/75'
                        }`}
                        style={{
                          fontFamily: line.style === 'accent' ? 'var(--font-display)' : 'var(--font-sans)',
                          fontSize: line.style === 'accent'
                            ? 'clamp(1.5rem, 3vw, 2.2rem)'
                            : line.style === 'bold'
                            ? 'clamp(1.05rem, 1.8vw, 1.25rem)'
                            : 'clamp(0.95rem, 1.5vw, 1.1rem)',
                          lineHeight: 1.6,
                          transitionDelay: `${0.3 + i * 0.07}s`,
                        }}
                      >
                        {line.text}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Horizontal divider */}
              <div
                className={`my-8 h-[1px] bg-gradient-to-r from-[#e53935]/40 via-[#e53935]/10 to-transparent transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '1s', transformOrigin: 'left' }}
              />

              {/* Founder badge */}
              <div
                className={`flex items-center gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '1.1s' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#e53935]/15 border border-[#e53935]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#e53935] text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>DB</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Daniel Bojorque</p>
                  <p className="text-white/40 text-xs">Fundador de Ajitate</p>
                </div>
              </div>

              {/* Stats row */}
              <div
                className={`mt-8 flex gap-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '1.3s' }}
              >
                {[
                  { num: '2019', label: 'Fundado' },
                  { num: '5K+', label: 'Clientes felices' },
                  { num: 'Cuenca', label: 'Ecuador' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[#e53935] text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{stat.num}</p>
                    <p className="text-white/35 text-[11px] uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
