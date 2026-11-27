import { useRef, useState } from 'react'

const FILM = 'https://res.cloudinary.com/dlsw7vg31/video/upload/v1786686488/ElevenLabs_video_seedance-2-0_replicate_the_V_2026-08-14T05_43_39_hobtha.mp4'

export function BrandFilm() {
  const dialog = useRef<HTMLDialogElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const open = () => {
    setLoaded(true)
    setFailed(false)
    dialog.current?.showModal()
  }
  return <>
    <button className="cover-film-link" onClick={open}><span aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path d="m7 4 9 6-9 6z" /></svg></span>Ver video</button>
    <dialog ref={dialog} className="brand-film" aria-labelledby="film-title" onClose={() => { video.current?.pause(); setLoaded(false) }} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }}>
      <div className="brand-film-shell"><div className="brand-film-heading"><h2 id="film-title">La pasión de comer</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar video" autoFocus>×</button></div>
        {loaded && <video ref={video} src={FILM} controls playsInline autoPlay muted onError={() => setFailed(true)} poster={`${import.meta.env.BASE_URL}images/ajitate-instagram-spread-2026-08-24.jpg`} aria-label="Video de Ajitate" />}
        {failed && <p>No se pudo cargar el video. <a href={FILM} target="_blank" rel="noreferrer">Abrir el video original ↗</a></p>}
      </div>
    </dialog>
  </>
}
