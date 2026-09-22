const moments = [
  {
    image: 'ajitate-guest-dining-2025-10-30.jpg',
    alt: 'Comensal disfrutando la comida frente al mural de Ajitate',
    label: 'EN BUENA COMPAÑÍA',
    source: 'https://www.facebook.com/photo.php?fbid=122190652154358208&set=pb.61560746246876.-2207520000&type=3',
  },
  {
    image: 'ajitate-dining-room-2025-06-11.jpg',
    alt: 'Comensal en Ajitate, con el letrero La pasión de comer en el comedor',
    label: 'NUESTRA CASA',
    source: 'https://www.facebook.com/photo.php?fbid=122173514684358208&set=pb.61560746246876.-2207520000&type=3',
  },
]

export function MomentsGallery() {
  return (
    <section id="momentos" className="moments-section" aria-labelledby="moments-title">
      <div className="moments-heading">
        <p className="section-kicker">MOMENTOS EN AJITATE</p>
        <h2 id="moments-title">AQUÍ SE VIVE <span>EL SABOR.</span></h2>
        <p>Buena comida, buena compañía y un lugar para disfrutar sin prisa.</p>
      </div>
      <div className="moments-grid">
        {moments.map(({image,alt,label,source}) => (
          <a className="moment-card" href={source} target="_blank" rel="noreferrer" key={image} aria-label={`${alt}. Ver foto original en Facebook`}>
            <img src={`${import.meta.env.BASE_URL}images/${image}`} alt={alt} loading="lazy" />
            <span className="moment-label">{label}<span aria-hidden="true">↗</span></span>
          </a>
        ))}
      </div>
    </section>
  )
}
