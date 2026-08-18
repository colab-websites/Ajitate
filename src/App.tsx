import { useIsDesktop } from './hooks/useIsDesktop'
import { DesktopHero } from './components/DesktopHero'
import { DesktopNavbar } from './components/DesktopNavbar'
import { MobileHero } from './components/MobileHero'

export default function App() {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <>
        <DesktopNavbar />
        <DesktopHero />
      </>
    )
  }

  return <MobileHero />
}
