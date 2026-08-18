import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

type RevealOpts = {
  duration?: number
  stagger?: number
}

export function useHeroTimeline(
  scopeRef: React.RefObject<HTMLElement | null>,
  ready: boolean
) {
  const firedRef = useRef(false)

  useGSAP(
    () => {
      if (!scopeRef.current || !ready || firedRef.current) return
      firedRef.current = true

      const q = gsap.utils.selector(scopeRef)

      const reveal = (
        tl: gsap.core.Timeline,
        targets: HTMLElement[],
        at: number | string,
        opts: RevealOpts
      ) => {
        // Set initial state from data attributes
        targets.forEach((el) => {
          gsap.set(el, {
            x: parseFloat(el.dataset.fromX || '0'),
            y: parseFloat(el.dataset.fromY || '0'),
            scale: parseFloat(el.dataset.fromScale || '1'),
            opacity: 0,
          })
        })

        // Animate to rest
        tl.to(targets, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: opts.duration ?? 0.7,
          ease: 'power3.out',
          stagger: opts.stagger,
        }, at)
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline()

        const letters = q<HTMLElement>('[data-headline-letter]')
        reveal(tl, letters, 0.15, { duration: 0.55, stagger: 0.035 })

        const ring = q<HTMLElement>('[data-badge-ring]')
        reveal(tl, ring, 0.75, { duration: 0.7 })

        const glyph = q<HTMLElement>('[data-badge-glyph]')
        reveal(tl, glyph, 0.95, { duration: 0.6 })

        const words = q<HTMLElement>('[data-paragraph-word]')
        reveal(tl, words, 0.9, { duration: 0.5, stagger: 0.025 })

        const socials = q<HTMLElement>('[data-social-icon]')
        reveal(tl, socials, 1.1, { duration: 0.6, stagger: 0.12 })

        // Idle spin of badge ring
        tl.to(q('[data-badge-ring]'), {
          rotate: 360,
          duration: 26,
          ease: 'none',
          repeat: -1,
        }, '>-0.2')
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-anim]'), {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
        })

        gsap.to(q('[data-badge-ring]'), {
          rotate: 360,
          duration: 26,
          ease: 'none',
          repeat: -1,
        })
      })

      return () => {
        mm.revert()
      }
    },
    { scope: scopeRef, dependencies: [ready] }
  )
}
