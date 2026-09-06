import { useEffect, useRef, useState } from 'react'
import { MENU, lineKey, money, subtotal, unitPrice } from '../data/menu'
import type { CartLine } from '../data/menu'

export function OrderDrawer({request}:{request:{serial:number;id:string}}) {
  const dialog=useRef<HTMLDialogElement>(null)
  const [step,setStep]=useState<'browse'|'item'|'cart'|'details'|'summary'>('browse')
  const [selected,setSelected]=useState(MENU[0].id)
  const [side,setSide]=useState('')
  const [quantity,setQuantity]=useState(1)
  const [cart,setCart]=useState<CartLine[]>([])
  const [category,setCategory]=useState('Todo')
  const [search,setSearch]=useState('')
  const [name,setName]=useState('')
  const [phone,setPhone]=useState('')
  const [method,setMethod]=useState('delivery')
  const [address,setAddress]=useState('')
  const [notes,setNotes]=useState('')
  const [copied,setCopied]=useState(false)
  const [notice,setNotice]=useState('')
  const item=MENU.find(i=>i.id===selected)!
  const count=cart.reduce((s,l)=>s+l.quantity,0)
  const total=subtotal(cart)
  const choose=(id:string)=>{setSelected(id);setSide('');setQuantity(1);setStep('item');setNotice('')}
  useEffect(()=>{
    if(!request.serial)return
    if(request.id)choose(request.id);else setStep('browse')
    setCopied(false);setNotice('')
    dialog.current?.showModal()
  },[request.serial])
  const close=()=>dialog.current?.close()
  const add=()=>{
    const next={id:item.id,side:item.combo?side:'',quantity}
    setCart(previous=>{
      const existing=previous.find(l=>lineKey(l)===lineKey(next))
      return existing?previous.map(l=>lineKey(l)===lineKey(next)?{...l,quantity:Math.min(99,l.quantity+quantity)}:l):[...previous,next]
    })
    setNotice(`${item.name} agregado`);setStep('cart')
  }
  const change=(key:string,delta:number)=>setCart(previous=>previous.map(l=>lineKey(l)===key?{...l,quantity:Math.min(99,l.quantity+delta)}:l).filter(l=>l.quantity>0))
  const summary=[
    'Hola Ajitate, quisiera confirmar este pedido:',
    ...cart.map(l=>`${l.quantity} × ${MENU.find(i=>i.id===l.id)!.name}${l.side?` · Combo: ${l.side} + bebida`:''}: ${money(unitPrice(l)*l.quantity)}`),
    `Subtotal de productos: ${money(total)}`,
    method==='delivery'?`Entrega a domicilio: ${address.trim()}`:'Retiro en el local (por confirmar)',
    `Nombre: ${name.trim()}`,`Teléfono: ${phone.trim()}`,
    ...(notes.trim()?[`Notas: ${notes.trim()}`]:[]),
    'Por favor confirmar disponibilidad, opciones de bebida del combo, costo de entrega, total final y forma de pago.'
  ].join('\n')
  const copy=async()=>{try {await navigator.clipboard.writeText(summary);setCopied(true)} catch {setNotice('No se pudo copiar automáticamente. Selecciona el resumen para copiarlo.')}}
  const heading={browse:'¿QUÉ SE TE ANTOJA?',item:item.name,cart:'TU PEDIDO',details:'LOS ÚLTIMOS DETALLES',summary:'TODO LISTO PARA CONSULTAR'}[step]
  return <>
    {count>0&&<button className="cart-floating liquid-panel" onClick={()=>{setStep('cart');dialog.current?.showModal()}}>Tu pedido <b>{count}</b> · {money(total)}</button>}
    <dialog ref={dialog} className="order-drawer" aria-labelledby="drawer-title" onClick={e=>{if(e.target===e.currentTarget)close()}}>
      <div className="drawer-shell">
        <header className="drawer-header"><div><p className="section-kicker">PEDIDOS AJITATE</p><h2 id="drawer-title">{heading}</h2></div><button className="drawer-close" aria-label="Cerrar pedido" onClick={close}>×</button></header>
        <nav className="drawer-steps" aria-label="Pasos del pedido"><button onClick={()=>setStep('browse')} aria-current={step==='browse'||step==='item'?'step':undefined}>1 · Menú</button><button onClick={()=>setStep('cart')} aria-current={step==='cart'?'step':undefined}>2 · Pedido ({count})</button><span aria-current={step==='details'||step==='summary'?'step':undefined}>3 · Confirmar</span></nav>
        <div className="drawer-body">
          {notice&&step==='cart'&&cart.length>0&&<p className="order-notice" role="status">{notice}</p>}
          {step==='browse'&&<>
            <input className="order-input" type="search" aria-label="Buscar producto para pedir" placeholder="Hamburguesa, tacos, bebida…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <div className="drawer-categories">{['Todo',...new Set(MENU.map(i=>i.category))].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
            <div className="drawer-products">{MENU.filter(i=>(category==='Todo'||i.category===category)&&i.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(i=><button key={i.id} onClick={()=>choose(i.id)}><span><small>{i.category}</small><strong>{i.name}</strong></span><span>{money(i.price)} <b>+</b></span></button>)}</div>
            {!MENU.some(i=>(category==='Todo'||i.category===category)&&i.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))&&<p>No encontramos ese producto.</p>}
          </>}
          {step==='item'&&<div className="item-options"><span className="food-category">{item.category}</span><p>{item.description}</p><strong className="item-price">{money(item.price)}</strong>
            {item.combo&&<fieldset><legend>¿Lo hacemos combo? + {money(199)}</legend><p className="order-hint">Incluye chilli nachos o papas y bebida. Las opciones de bebida se confirman con el restaurante.</p>{[['','Solo el plato'],['Chilli nachos','Combo con chilli nachos'],['Papas','Combo con papas']].map(([value,label])=><label key={value} className="option-choice"><input type="radio" name="combo" checked={side===value} onChange={()=>setSide(value)}/>{label}</label>)}</fieldset>}
            <div className="quantity-row"><span>Cantidad</span><div className="quantity-control"><button aria-label="Reducir cantidad" disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)}>−</button><output aria-live="polite">{quantity}</output><button aria-label="Aumentar cantidad" disabled={quantity>=99} onClick={()=>setQuantity(q=>q+1)}>+</button></div></div>
            <button className="order-primary" onClick={add}>Agregar al pedido · {money((item.price+(side&&item.combo?199:0))*quantity)}</button>
          </div>}
          {step==='cart'&&<>{!cart.length?<div className="empty-cart"><h3>Tu próximo antojo te espera.</h3><p>Agrega algo del menú para empezar.</p><button className="order-primary" onClick={()=>setStep('browse')}>Explorar menú</button></div>:<>
            {cart.map(line=>{const product=MENU.find(i=>i.id===line.id)!;return <article key={lineKey(line)} className="cart-line"><div><h3>{product.name}</h3>{line.side&&<p>Combo: {line.side} + bebida</p>}<strong>{money(unitPrice(line)*line.quantity)}</strong></div><div className="quantity-control"><button aria-label={`Reducir ${product.name}${line.side?' combo':''}`} onClick={()=>change(lineKey(line),-1)}>−</button><output>{line.quantity}</output><button aria-label={`Aumentar ${product.name}${line.side?' combo':''}`} disabled={line.quantity>=99} onClick={()=>change(lineKey(line),1)}>+</button></div><button className="remove-line" onClick={()=>setCart(c=>c.filter(l=>lineKey(l)!==lineKey(line)))} aria-label={`Eliminar ${product.name}${line.side?' combo':''}`}>Eliminar</button></article>})}
            <button className="glass-action" onClick={()=>setStep('browse')}>+ Agregar más productos</button><div className="cart-total"><span>Subtotal de productos</span><strong>{money(total)}</strong></div><p className="order-hint">La entrega no está incluida. El restaurante confirmará disponibilidad y total final. No se realiza ningún cobro aquí.</p><button className="order-primary" onClick={()=>setStep('details')}>Continuar →</button>
          </>}</>}
          {step==='details'&&<form onSubmit={e=>{e.preventDefault();setCopied(false);setStep('summary')}}>
            <label className="form-label">Tu nombre<input className="order-input" required maxLength={80} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/></label>
            <label className="form-label">Teléfono<input className="order-input" required type="tel" pattern="[+0-9 ()-]{7,20}" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)}/></label>
            <fieldset><legend>¿Cómo lo prefieres?</legend><label className="option-choice"><input type="radio" name="delivery" checked={method==='delivery'} onChange={()=>setMethod('delivery')}/>A domicilio</label><label className="option-choice"><input type="radio" name="delivery" checked={method==='pickup'} onChange={()=>setMethod('pickup')}/>Retiro en el local · por confirmar</label></fieldset>
            {method==='delivery'&&<label className="form-label">Dirección y referencia<textarea className="order-input" required maxLength={400} autoComplete="street-address" value={address} onChange={e=>setAddress(e.target.value)}/></label>}
            <label className="form-label">Notas para el restaurante<textarea className="order-input" maxLength={600} placeholder="Preferencias, alergias o consultas…" value={notes} onChange={e=>setNotes(e.target.value)}/></label><p className="order-hint">Las modificaciones y solicitudes especiales están sujetas a confirmación.</p><button className="order-primary" type="submit">Revisar pedido · {money(total)}</button>
          </form>}
          {step==='summary'&&<><p className="order-hint">Revisa tu pedido antes de compartirlo. Todavía no ha sido enviado ni confirmado.</p><textarea className="order-summary" aria-label="Resumen del pedido" readOnly value={summary}/><button className="order-primary" onClick={copy}>{copied?'Resumen copiado ✓':'Copiar resumen del pedido'}</button><p role="status" className="order-hint">{copied?'Puedes pegar el resumen en tu conversación con el restaurante.':''}</p><a className="order-call" href="tel:+593983047406">Llamar al 0983047406 ↗</a><p className="order-hint">Número de pedidos publicado en el menú. Confirma el total y el pago directamente con Ajitate.</p><button className="glass-action" onClick={()=>setStep('details')}>Editar datos</button></>}
        </div>
      </div>
    </dialog>
  </>
}
