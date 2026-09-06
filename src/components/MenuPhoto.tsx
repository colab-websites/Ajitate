import type { MenuItem } from '../data/menu'
export function MenuPhoto({item,compact=false}:{item:MenuItem;compact?:boolean}) {
 return <figure className={`menu-product-photo ${compact?'is-compact':''}`}><img src={`${import.meta.env.BASE_URL}images/menu/${item.id}.jpg`} alt={`Ilustración de ${item.name}`} loading="lazy" decoding="async" width="512" height="512"/>{!compact&&<figcaption>Ilustración IA</figcaption>}</figure>
}
