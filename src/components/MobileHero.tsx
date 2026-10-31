import { SOCIALS } from '../data/socials'
import { CartIcon, ArrowDown } from '../icons/Icons'
import { HeroVideo } from './HeroVideo'

export function MobileHero({ onOrder }: { onOrder: (name?: string) => void }) {
  return (
    <div id="inicio" className="original-mobile-hero relative min-h-screen overflow-x-hidden bg-black pb-12 text-white">
      {/* Video banner */}
      <div className="mx-4 mt-2 h-[46vh] min-h-[300px] rounded-[28px] overflow-hidden relative fade-up" style={{ animationDelay: '0.1s' }}>
        <HeroVideo className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)',
          }}
        />

      </div>

      {/* Headline */}
      <div className="px-4 mt-6 fade-up" style={{ animationDelay: '0.18s' }}>
        <p className="hero-location">Tex-Mex con sabores de autor · Cuenca</p>
        <h1
          className="mobile-hero-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.8rem, 20vw, 6rem)',
            lineHeight: 0.86,
            color: '#ffffff',
            whiteSpace: 'nowrap',
            width: 'max-content',
            flexShrink: 0,
          }}
        >
          LA PASIÓN
          <br />
          <span style={{ color: '#ff3038' }}>DE COMER</span>
        </h1>
      </div>

      {/* Paragraph */}
      <p className="px-4 mt-5 text-[15px] leading-relaxed text-white/90 fade-up" style={{ animationDelay: '0.22s' }}>
        Hamburguesas, burritos y sabores muy nuestros. Ven con hambre. Quédate por el buen momento.
      </p>

      {/* Badge line */}
      <div className="px-4 mt-4 fade-up" style={{ animationDelay: '0.26s' }}>
        <span className="text-xs uppercase tracking-[0.2em] text-[#ff3038] font-semibold">
          50% TEX-MEX · 50% AJITATE
        </span>
      </div>

      {/* CTA row */}
      <div className="px-4 mt-5 flex items-center gap-3 fade-up" style={{ animationDelay: '0.30s' }}>
        <a href="#menu" className="flex items-center justify-center flex-1 h-12 rounded-full bg-[#ff3038] text-white font-semibold text-base">
          Ver menú
        </a>
        <button aria-label="Información de pedidos" onClick={() => onOrder()} className="size-12 rounded-full bg-white flex items-center justify-center text-black shrink-0">
          <CartIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Footer row */}
      <div className="px-4 mt-8 flex items-center justify-between fade-up" style={{ animationDelay: '0.38s' }}>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({Icon,name,href}, i) => (
            <a
              key={i}
              href={href} target="_blank" rel="noreferrer"
              aria-label={name}
              className="size-11 rounded-full border border-white/70 flex items-center justify-center text-white transition-colors hover:bg-white hover:text-black"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <a href="#menu" aria-label="Explorar menú" className="size-11 rounded-full border border-white/70 flex items-center justify-center text-white transition-colors hover:bg-white hover:text-black">
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}
