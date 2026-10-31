import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

const VIDEO_URL = 'https://res.cloudinary.com/dlsw7vg31/video/upload/v1786686488/ElevenLabs_video_seedance-2-0_replicate_the_V_2026-08-14T05_43_39_hobtha.mp4'

/** The original brand film, with an explicit pause control and still fallback. */
export function HeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (preference.matches) video.current?.pause()
      else video.current?.play().catch(() => setPlaying(false))
    }
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])
  return <>
    <video ref={video} muted playsInline loop preload="metadata" aria-hidden="true"
      poster={`${import.meta.env.BASE_URL}images/ajitate-instagram-spread-2026-08-24.jpg`}
      src={VIDEO_URL} className={className} style={style}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    {!failed && <button className="hero-video-control" aria-label={playing ? 'Pausar video de fondo' : 'Reproducir video de fondo'}
      onClick={() => { if (playing) video.current?.pause(); else video.current?.play().catch(() => setFailed(true)) }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{playing ? <><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></> : <path d="m8 4 12 8-12 8z"/>}</svg>
      <span>{playing ? 'Pausar' : 'Reproducir'}</span>
    </button>}
  </>
}
