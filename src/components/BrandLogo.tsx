export function BrandLogo({circle=false,className=''}:{circle?:boolean;className?:string}) {
  return <svg className={className} viewBox={circle?'668 290 501 500':'534 202 852 573'} role="img" aria-label="Ajitate"><image href={`${import.meta.env.BASE_URL}brand/logo-${circle?'circle':'full'}.png`} width="1920" height="1080"/></svg>
}
