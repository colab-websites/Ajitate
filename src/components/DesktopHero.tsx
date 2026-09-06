import { SOCIALS } from '../data/socials'
import { useRef, useState } from 'react'
import { useStageScale } from '../hooks/useStageScale'
import { useHeroTimeline } from '../hooks/useHeroTimeline'
import { InstagramIcon, FacebookIcon, YoutubeIcon, BurgerGlyph } from '../icons/Icons'

const VIDEO_URL =
  'https://res.cloudinary.com/dlsw7vg31/video/upload/v1786686488/ElevenLabs_video_seedance-2-0_replicate_the_V_2026-08-14T05_43_39_hobtha.mp4'

function HeadlineWords() {
  const line1 = 'SABOR QUE'.split('')
  const line2 = 'AJITA'.split('')

  return (
    <div
      style={{
        position: 'absolute',
        left: 'calc(0px * var(--hero-scale))',
        top: 'calc(200.76px * var(--hero-scale))',
        width: 'calc(900px * var(--hero-scale))',
      }}
    >
      {/* Line 1: SABOR QUE */}
      <div
        className="flex items-end"
        style={{ marginLeft: 'calc(24px * var(--hero-scale))', gap: 'calc(16px * var(--hero-scale))', whiteSpace: 'nowrap', width: 'max-content', flexShrink: 0 }}
      >
        <span style={{ width: 'max-content', flexShrink: 0 }}>
          {line1.map((char, i) => (
            <span
              key={`l1-${i}`}
              data-anim
              data-headline-letter
              data-from-y="99.37"
              className="inline-block hero-title-text"
              style={{
                fontSize: 'calc(150px * var(--hero-scale))',
                lineHeight: 0.84,
                letterSpacing: 'calc(-3.97px * var(--hero-scale))',
                color: char === ' ' ? 'transparent' : '#ffffff',                fontFamily: 'var(--font-display)',
                whiteSpace: 'nowrap',
                width: 'max-content',
                flexShrink: 0,
                textShadow: '0 6px 28px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>

      {/* Line 2: AJITA */}
      <div
        style={{
          marginTop: 'calc(31px * var(--hero-scale))',
          marginLeft: 'calc(320px * var(--hero-scale))',
          whiteSpace: 'nowrap',
          width: 'max-content',
          flexShrink: 0,
        }}
      >
        {line2.map((char, i) => (
          <span
            key={`l2-${i}`}
            data-anim
            data-headline-letter
            data-from-y="99.37"
            className="inline-block hero-title-text"
            style={{
              fontSize: 'calc(200px * var(--hero-scale))',
              lineHeight: 0.84,
              letterSpacing: 'calc(-5.39px * var(--hero-scale))',
              color: '#e53935',
              fontFamily: 'var(--font-display)',
              whiteSpace: 'nowrap',
              width: 'max-content',
              flexShrink: 0,
              textShadow: '0 6px 28px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}

function Badge() {
  return (
    <div
      style={{
        position: 'absolute',
        left: 'calc(0.52px * var(--hero-scale))',
        top: 'calc(328.52px * var(--hero-scale))',
        width: 'calc(256.48px * var(--hero-scale))',
        height: 'calc(256.48px * var(--hero-scale))',
      }}
    >
      <svg
        viewBox="0 0 256 256"
        className="w-full h-full"
        data-anim
        data-badge-ring
        data-from-scale="0"
      >
        {/* Outer ring */}
        <path
          d="M128,30 C155,28 180,40 198,58 C216,76 228,101 226,128 C224,155 212,180 194,198 C176,216 151,228 128,226 C105,224 80,212 62,194 C44,176 32,151 30,128 C28,105 40,80 58,62 C76,44 101,32 128,30Z"
          fill="none"
          stroke="#e53935"
          strokeWidth="1.4"
          opacity="0.55"
        />
        {/* Inner ring */}
        <path
          d="M128,42 C150,41 170,50 185,65 C200,80 209,100 208,128 C207,156 198,176 183,191 C168,206 148,215 128,214 C108,213 88,204 73,189 C58,174 49,154 48,128 C47,102 56,82 71,67 C86,52 106,43 128,42Z"
          fill="none"
          stroke="#e53935"
          strokeWidth="1.1"
          opacity="0.4"
        />
        {/* Text circle */}
        <defs>
          <path
            id="badge-text-circle"
            d="M128,128 m-98,0 a98,98 0 1,1 196,0 a98,98 0 1,1 -196,0"
          />
        </defs>
        <text fill="#ffffff" fontSize="12.5" letterSpacing="2.2" fontWeight="600">
          <textPath href="#badge-text-circle" startOffset="0%">
            TEX-MEX EN CUENCA  •  FAMILIA Y SABOR  •  {' '}
          </textPath>
        </text>
        {/* Dots */}
        <circle cx="128" cy="30" r="2.6" fill="#e53935" />
        <circle cx="128" cy="226" r="2.6" fill="#e53935" />
      </svg>

      {/* Center glyph */}
      <div
        data-anim
        data-badge-glyph
        data-from-x="-140"
        className="hero-badge-glyph absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px]"
      >
        <BurgerGlyph className="w-full h-full" />
      </div>
    </div>
  )
}

function IntroParagraph() {
  const text =
    'Ajitate es el lugar perfecto en Cuenca donde la familia, las risas y el sabor tex-mex se encuentran. Fundado por Daniel Bojorque, te esperamos con hamburguesas, tacos, burritos, costillas y papas BBQ que te van a volar la cabeza.'
  const words = text.split(' ')

  return (
    <div
      style={{
        position: 'absolute',
        left: 'calc(170.7px * var(--hero-scale))',
        top: 'calc(602px * var(--hero-scale))',
        fontSize: 'calc(18px * var(--hero-scale))',
        lineHeight: 1.4,
        color: 'white',
        textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        width: 'max-content',
        maxWidth: 'calc(459.25px * var(--hero-scale))',
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          data-anim
          data-paragraph-word
          data-from-y="28"
          className="inline-block"
          style={{ marginRight: '0.32em' }}
        >
          {i === 0 ? (
            <strong>{word}</strong>
          ) : (
            word
          )}
        </span>
      ))}
    </div>
  )
}

function SocialRail() {
  const icons = SOCIALS.map((social,i)=>({...social,x:110+i*80}))

  return (
    <div
      style={{
        position: 'absolute',
        left: 'calc(1368.87px * var(--hero-scale))',
        top: 'calc(152px * var(--hero-scale))',
        width: 'calc(47.26px * var(--hero-scale))',
        height: 'calc(201px * var(--hero-scale))',
      }}
    >
      {icons.map(({ Icon, x, name, href }, i) => (
        <a
          key={i}
          href={href} target="_blank" rel="noreferrer"
          aria-label={name}
          data-anim
          data-social-icon
          data-from-x={x}
          className="hero-social-link absolute flex items-center justify-center rounded-full border border-white/70 text-white w-[47.26px] h-[47.26px] transition-colors hover:bg-white hover:text-black"
          style={{ top: `calc(${i * 76.87}px * var(--hero-scale))` }}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  )
}

export function DesktopHero() {
  const scopeRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const firedRef = useRef(false)

  const { containerRef, scale } = useStageScale()
  useHeroTimeline(scopeRef, ready)

  const handleVideoReady = () => {
    if (firedRef.current) return
    firedRef.current = true
    setReady(true)
  }

  return (
    <div id="inicio" ref={containerRef} className="original-desktop-hero relative w-full h-screen overflow-hidden" style={{ background: '#000', '--hero-scale': scale } as React.CSSProperties}>
        {/* Background video */}
        <video
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          src={VIDEO_URL}
          onCanPlay={handleVideoReady}
          onLoadedData={handleVideoReady}
          style={{
            position: 'absolute',
            left: '24%',
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: 'none',
          }}
        />

        {/* Left edge blend */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #000 0%, #000 25%, rgba(0,0,0,0.85) 34%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floor glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(480px 320px at 8% 92%, rgba(229,57,53,0.2), rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top/bottom vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          }}
        />

      <h1 className="sr-only">SABOR QUE AJITA</h1>
      <div
        ref={scopeRef}
        style={{
          position: 'absolute',
          width: 'calc(1440px * var(--hero-scale))',
          height: 'calc(810px * var(--hero-scale))',
          left: 'calc(50% - 720px * var(--hero-scale))',
          top: 'calc(50% - 405px * var(--hero-scale))',
          transformOrigin: 'center center',
        }}
      >
        {/* Headline */}
        <HeadlineWords />

        {/* Badge */}
        <Badge />

        {/* Paragraph */}
        <IntroParagraph />

        {/* Social rail */}
        <SocialRail />
      </div>
    </div>
  )
}
