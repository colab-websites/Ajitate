import { useIsDesktop } from './hooks/useIsDesktop'
import { DesktopHero } from './components/DesktopHero'
import { DesktopNavbar } from './components/DesktopNavbar'
import { MobileHero } from './components/MobileHero'
import { SpecialtiesMenu } from './components/SpecialtiesMenu'
import { StorySection } from './components/StorySection'
import { TestimonialsSection } from './components/TestimonialsSection'

export default function App() {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <>
        <DesktopNavbar />
        <DesktopHero />
        <SpecialtiesMenu />
        <StorySection />
        <TestimonialsSection />
      </>
    )
  }

  return (
    <>
      <MobileHero />
      <SpecialtiesMenu />
      <StorySection />
      <TestimonialsSection />
    </>
  )
}
