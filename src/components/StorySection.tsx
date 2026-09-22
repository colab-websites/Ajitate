const STORY_IMAGE =
  'https://res.cloudinary.com/dklycgquj/image/upload/v1787201076/historia_u5skcx.jpg'

export function StorySection() {
  return (
    <section className="story-section">
      <div className="story-content">
        <div className="story-layout">
          <figure className="story-photo">
            <img src={STORY_IMAGE} alt="Imagen de la historia de Ajitate" loading="lazy" />
          </figure>
          <div className="story-copy">
            <p className="section-kicker">NUESTRA HISTORIA</p>
            <h2>TODO EMPEZÓ <span>DESDE CERO.</span></h2>
            <p>Desde 2019, Daniel Bojorque comenzó vendiendo burritos y hamburguesas a domicilio desde su propia casa, impulsado por el deseo de crear algo propio y convertir una idea en realidad.</p>
            <p>Años después, mientras estudiaba música, dio el siguiente paso junto a su papá, Fredy Bojorque: construyeron un pequeño kiosco que se convertiría en el punto de partida para el crecimiento de la marca.</p>
            <p>En 2024, Daniel fundó oficialmente AJITATE. Empezó una nueva etapa con una identidad renovada, una propuesta más definida y un menú mucho más variado.</p>
            <p>Lo que comenzó desde una casa, con esfuerzo, familia y ganas de salir adelante, se convirtió en una marca que hoy busca llevar una experiencia diferente de sabor a cada persona que nos visita.</p>
            <p className="story-signoff">De cero, con sabor y con propósito. Esta es la historia de AJITATE.</p>
            <blockquote>“Todo es por gracia y gloria de Dios”</blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
