import './restaurant-editorial.css'

export function StorySection() {
  return (
    <section className="aj-story" aria-labelledby="aj-story-title">
      <div className="aj-story-inner">
        <header className="aj-story-intro">
          <p className="section-kicker">Nuestra historia</p>
          <h2 id="aj-story-title">Todo empezó<br /><span>en casa.</span></h2>
          <blockquote>“Todo es por gracia y gloria de Dios”</blockquote>
        </header>
        <ol className="aj-story-chapters" aria-label="La historia de Ajitate">
          <li>
            <span className="aj-story-chapter-date">2019</span>
            <div><h3>Los primeros pedidos</h3><p>Daniel Bojorque empezó a vender burritos y hamburguesas a domicilio desde su casa.</p></div>
          </li>
          <li>
            <span className="aj-story-chapter-date">El kiosco</span>
            <div><h3>Un proyecto de familia</h3><p>Mientras estudiaba música, Daniel construyó un pequeño kiosco junto a su papá, Fredy Bojorque. Allí empezó a crecer el negocio.</p></div>
          </li>
          <li>
            <span className="aj-story-chapter-date">2024</span>
            <div><h3>Nace Ajitate</h3><p>Daniel fundó oficialmente Ajitate. Con la nueva identidad llegó una carta más amplia, con Tex-Mex y sabores de autor.</p></div>
          </li>
        </ol>
      </div>
    </section>
  )
}
