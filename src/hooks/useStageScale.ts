import { useState, useEffect, useRef, useCallback } from 'react'

const STAGE_W = 1440
const STAGE_H = 810

export function useStageScale() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const compute = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    setScale(Math.max(vw / STAGE_W, vh / STAGE_H))
  }, [])

  useEffect(() => {
    compute()
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(compute)
    ro.observe(el)

    const onOrientation = () => compute()
    window.addEventListener('orientationchange', onOrientation)

    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', onOrientation)
    }
  }, [compute])

  return { containerRef, scale, stageWidth: STAGE_W, stageHeight: STAGE_H }
}
