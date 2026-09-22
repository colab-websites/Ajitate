import type { MenuItem } from '../data/menu'
export function MenuPhoto({item,compact=false}:{item:MenuItem;compact?:boolean}) {
 const src = item.id === 'yummy-jam' ? 'images/menu/yummy-jam-peaches.png' : `images/menu/${item.id}.jpg`
 return <figure className={`menu-product-photo ${compact?'is-compact':''}`}><img src={`${import.meta.env.BASE_URL}${src}`} alt={`Ilustración de ${item.name}${item.id === 'yummy-jam' ? ' con duraznos al lado' : ''}`} loading="lazy" decoding="async" width="512" height="512"/>{!compact&&<figcaption>Ilustración IA</figcaption>}</figure>
}
