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

export function MobileHero() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black pb-12 text-white">
      {/* Sticky navbar */}
      <nav className="sticky top-0 z-20 bg-black/90 backdrop-blur-sm px-4 py-3 fade-up" style={{ animationDelay: '0s' }}>
        <div className="flex items-center justify-between">
          <img src={LOGO_URL} alt="Ajitate" className="h-27 w-auto" />
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-full bg-white/15 flex items-center justify-center text-white">
              <SearchIcon className="w-4 h-4" />
            </button>
            <button className="relative size-9 rounded-full bg-white flex items-center justify-center text-black">
              <CartIcon className="w-4 h-4" />
              <span className="absolute -right-0.5 -top-0.5 size-[9px] rounded-full bg-red-500" />
            </button>
            <img
              src={`${ASSET_BASE}/avatar.png`}
              alt="avatar"
              className="size-9 rounded-full border-2 border-white object-cover"
            />
          </div>
        </div>
      </nav>

      {/* Nav pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 pt-1 fade-up" style={{ animationDelay: '0.05s' }}>
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${
              i === 0
                ? 'bg-[#e53935] font-semibold text-white'
                : 'bg-white/10 text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

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
        <button className="flex-1 h-12 rounded-full bg-[#e53935] text-white font-semibold text-base">
          Ver Menú
        </button>
        <button className="size-12 rounded-full bg-white flex items-center justify-center text-black shrink-0">
          <CartIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Product rail */}
      <div className="mt-8 px-4 fade-up" style={{ animationDelay: '0.32s' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">Menú</span>
          <div className="flex items-center gap-2">
            <button className="size-8 rounded-full bg-white/15 flex items-center justify-center text-white">
              <CaretLeft className="w-4 h-4" />
            </button>
            <button className="size-8 rounded-full bg-white/15 flex items-center justify-center text-white">
              <CaretRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          {PRODUCTS.map((p, i) => (
            <div
              key={i}
              className="shrink-0 snap-start rounded-[24px] bg-white/10 backdrop-blur-sm p-1 pb-5"
              style={{ width: '62vw' }}
            >
              <div
                className="relative h-[110px] rounded-[16px] overflow-hidden"
                style={{ background: p.bg }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[140px] object-contain"
                  style={{ transform: 'translate(-50%, -22%)' }}
                />
              </div>
              <div className="px-3 pt-3">
                <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                {p.desc && (
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">{p.desc}</p>
                )}
                {p.price && (
                  <p className="text-sm font-semibold mt-1" style={{ color: '#e53935' }}>
                    {p.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer row */}
      <div className="px-4 mt-8 flex items-center justify-between fade-up" style={{ animationDelay: '0.38s' }}>
        <div className="flex items-center gap-3">
          {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="size-11 rounded-full border border-white/70 flex items-center justify-center text-white transition-colors hover:bg-white hover:text-black"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <button className="size-11 rounded-full border border-white/70 flex items-center justify-center text-white transition-colors hover:bg-white hover:text-black">
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
