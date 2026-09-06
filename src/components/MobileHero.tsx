import { CartIcon, SearchIcon, InstagramIcon, FacebookIcon, YoutubeIcon, ArrowDown, CaretLeft, CaretRight } from '../icons/Icons'

const LOGO_URL = 'https://res.cloudinary.com/dlsw7vg31/image/upload/v1786686042/AJITATE_LOGO_sin_slogan_f9iqsw.png'
const VIDEO_URL =
  'https://res.cloudinary.com/dlsw7vg31/video/upload/v1786686488/ElevenLabs_video_seedance-2-0_replicate_the_V_2026-08-14T05_43_39_hobtha.mp4'
const ASSET_BASE =
  'https://pub-36eefd528bbb4e28bdef0ce39a1018e0.r2.dev/Prompt/21-canger-burguer/public/assets'

const NAV_ITEMS = ['Inicio', 'Menú', 'Especiales', 'Nosotros', 'Ubicación']

const PRODUCTS = [
  {
    name: 'Burger Texana',
    desc: 'Doble carne, queso ahumado, pepinillos y salsa BBQ',
    price: '$12.9',
    img: `${ASSET_BASE}/product-1.png`,
    bg: 'rgba(229,57,53,0.15)',
  },
  {
    name: 'Taco Loco',
    desc: 'Carne asada, guacamol y pico de gallo',
    price: '$8.5',
    img: `${ASSET_BASE}/product-2.png`,
    bg: 'rgba(229,57,53,0.1)',
  },
  {
    name: 'Burrito Gigante',
    desc: 'Arroz, frijoles, carne y queso derretido',
    price: '$10.9',
    img: `${ASSET_BASE}/product-3.png`,
    bg: 'rgba(229,57,53,0.08)',
  },
]

export function MobileHero({ onOrder }: { onOrder: (name?: string) => void }) {
  return (
    <div id="inicio" className="original-mobile-hero relative min-h-screen overflow-x-hidden bg-black pb-12 text-white">
      {/* Video banner */}
      <div className="mx-4 mt-2 h-[46vh] min-h-[300px] rounded-[28px] overflow-hidden relative fade-up" style={{ animationDelay: '0.1s' }}>
        <video
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        {/* Badge */}
        <div className="absolute bottom-4 left-4 size-16 rounded-full border border-white/40 bg-black/70 flex items-center justify-center">
          <img src={LOGO_URL} alt="Ajitate" className="h-14 w-auto" />
        </div>
      </div>

      {/* Headline */}
      <div className="px-4 mt-6 fade-up" style={{ animationDelay: '0.18s' }}>
        <h1
          className="grunge-text"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 15vw, 4.2rem)',
            lineHeight: 0.86,
            color: '#ffffff',
            whiteSpace: 'nowrap',
            width: 'max-content',
            flexShrink: 0,
          }}
        >
          SABOR QUE
          <br />
          <span style={{ color: '#e53935' }}>AJITA</span>
        </h1>
      </div>

      {/* Paragraph */}
      <p className="px-4 mt-5 text-[15px] leading-relaxed text-white/90 fade-up" style={{ animationDelay: '0.22s' }}>
        <strong>Ajitate</strong> es el lugar perfecto en Cuenca donde la familia, las risas y el sabor tex-mex se encuentran. Fundado por Daniel Bojorque, te esperamos con hamburguesas, tacos, burritos, costillas y papas BBQ.
      </p>

      {/* Badge line */}
      <div className="px-4 mt-4 fade-up" style={{ animationDelay: '0.26s' }}>
        <span className="text-xs uppercase tracking-[0.2em] text-[#e53935] font-semibold">
          TEX-MEX EN CUENCA
        </span>
      </div>

      {/* CTA row */}
      <div className="px-4 mt-5 flex items-center gap-3 fade-up" style={{ animationDelay: '0.30s' }}>
        <a href="#menu" className="flex items-center justify-center flex-1 h-12 rounded-full bg-[#e53935] text-white font-semibold text-base">
          Ver Menú
        </a>
        <button aria-label="Información de pedidos" onClick={() => onOrder()} className="size-12 rounded-full bg-white flex items-center justify-center text-black shrink-0">
          <CartIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Footer row */}
      <div className="px-4 mt-8 flex items-center justify-between fade-up" style={{ animationDelay: '0.38s' }}>
        <div className="flex items-center gap-3">
          {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
            <a
              key={i}
              href="#redes"
              aria-label={`${['Instagram', 'Facebook', 'YouTube'][i]}: información de redes oficiales`}
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
