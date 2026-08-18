import { CartIcon } from '../icons/Icons'

const LOGO_URL = 'https://res.cloudinary.com/dlsw7vg31/image/upload/v1786686042/AJITATE_LOGO_sin_slogan_f9iqsw.png'
const NAV_ITEMS = ['Inicio', 'Menú', 'Especiales', 'Nosotros', 'Ubicación']

const glassStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
}

export function DesktopNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 lg:px-10">
      {/* Left: logo image */}
      <div className="flex items-center gap-2 fade-up" style={{ animationDelay: '0s' }}>
        <img src={LOGO_URL} alt="Ajitate" className="h-30 w-auto" />
      </div>

      {/* Center: liquid-glass nav pill */}
      <nav
        className="hidden lg:flex items-center rounded-full p-1 fade-up"
        style={{ ...glassStyle, animationDelay: '0.05s' }}
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item}
            className={`px-5 py-3.5 rounded-full text-sm transition-colors ${
              i === 0
                ? 'bg-[#e53935] font-semibold text-white shadow-lg shadow-red-500/25'
                : 'font-normal text-white/75 hover:text-white hover:bg-white/10'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Right: CTA "Pide Aquí!" */}
      <div className="flex items-center gap-3 fade-up" style={{ animationDelay: '0.1s' }}>
        <button
          className="group relative flex h-[52px] items-center gap-2 rounded-full bg-[#e53935] pl-5 pr-6 text-white transition-colors hover:bg-[#c62828]"
        >
          <CartIcon className="w-5 h-5" />
          <span className="text-base font-semibold tracking-wide">Pide Aquí!</span>
          <span className="absolute -right-1 -top-0.5 size-[11px] rounded-full bg-red-500 ring-2 ring-black/40" />
        </button>
      </div>
    </header>
  )
}
