import { BurgerGlyph } from '../icons/Icons'

const ASSET_BASE =
  'https://pub-36eefd528bbb4e28bdef0ce39a1018e0.r2.dev/Prompt/21-canger-burguer/public/assets'

const ESPECIALIDADES = [
  {
    name: 'Burger Texana',
    desc: 'Doble carne smash, queso ahumado, pepinillos y salsa BBQ casera sobre brioche tostado.',
    price: '$12.90',
    img: `${ASSET_BASE}/product-1.png`,
    bg: 'rgba(229, 57, 53, 0.1)',
    accent: '#e53935',
    tag: 'Favorita',
    gridArea: 'tall',
  },
  {
    name: 'Tacos al Pastor',
    desc: 'Carne marinada al estilo tradicional, piña caramelizada, cilantro fresco y cebolla morada.',
    price: '$8.50',
    img: `${ASSET_BASE}/product-2.png`,
    bg: 'rgba(255, 152, 0, 0.1)',
    accent: '#ff9800',
    tag: '',
    gridArea: '',
  },
  {
    name: 'Burrito Gigante',
    desc: 'Arroz, frijoles, carne, queso derretido, guacamol y crema — todo envuelto en tortilla XL.',
    price: '$10.90',
    img: `${ASSET_BASE}/product-3.png`,
    bg: 'rgba(76, 175, 80, 0.1)',
    accent: '#4caf50',
    tag: '',
    gridArea: '',
  },
  {
    name: 'Costillas BBQ',
    desc: 'Costillas de cerdo glaseadas con BBQ ahumado, horneadas hasta quedar tiernas.',
    price: '$14.50',
    img: '',
    bg: 'rgba(156, 39, 176, 0.1)',
    accent: '#9c27b0',
    tag: 'Chef',
    gridArea: '',
  },
  {
    name: 'Papas BBQ',
    desc: 'Papas crujientes cubiertas con queso cheddar, bacon y jalapeños frescos.',
    price: '$7.90',
    img: '',
    bg: 'rgba(33, 150, 243, 0.1)',
    accent: '#2196f3',
    tag: '',
    gridArea: '',
  },
]

function SpecCard({ item, index }: { item: typeof ESPECIALIDADES[0]; index: number }) {
  const delay = index * 0.1

  return (
    <div
      className={`spec-card ${item.gridArea}`}
      style={{
        '--accent': item.accent,
        animationDelay: `${delay}s`,
        background: item.bg,
      } as React.CSSProperties}
    >
      {/* Background image or glyph */}
      {item.img ? (
        <img src={item.img} alt={item.name} className="spec-img" />
      ) : (
        <div className="spec-img flex items-center justify-center" style={{ background: item.bg }}>
          <BurgerGlyph className="w-24 h-24 opacity-20" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="spec-overlay" />

      {/* Glow dot */}
      <div
        className="spec-glow absolute top-4 right-4 size-3 rounded-full z-10"
        style={{ background: item.accent, boxShadow: `0 0 20px 6px ${item.accent}60` }}
      />

      {/* Tag */}
      {item.tag && (
        <span
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white"
          style={{ background: item.accent }}
        >
          {item.tag}
        </span>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        {/* Name */}
        <h3
          className="spec-name text-white mb-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}
        >
          {item.name}
        </h3>

        {/* Description */}
        <p className="spec-desc text-white/70 text-sm leading-relaxed mb-3 pr-4">
          {item.desc}
        </p>

        {/* Price + Button row */}
        <div className="flex items-center justify-between">
          <span
            className="spec-price text-xl font-bold"
            style={{ color: item.accent }}
          >
            {item.price}
          </span>
          <button
            className="spec-btn px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            Ordenar
          </button>
        </div>
      </div>
    </div>
  )
}

export function SpecialtiesMenu() {
  return (
    <section className="relative bg-black py-20 px-6 lg:px-16">
      {/* Decorative background glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 600px 400px at 20% 20%, rgba(229,57,53,0.15), transparent 70%), radial-gradient(ellipse 500px 350px at 80% 80%, rgba(255,152,0,0.1), transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-14 fade-up" style={{ animationDelay: '0s' }}>
          <span className="text-[#e53935] text-sm font-semibold uppercase tracking-[0.3em] block mb-3">
            Nuestros Favoritos
          </span>
          <h2
            className="text-white"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-2px',
            }}
          >
            ESPECIALES
          </h2>
          <div className="mt-4 h-[3px] w-16 bg-[#e53935] rounded-full" />
        </div>

        {/* Asymmetric grid */}
        <div className="spec-grid">
          {ESPECIALIDADES.map((item, i) => (
            <SpecCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
