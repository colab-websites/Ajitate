import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export type Pin = { lat: number; lng: number }
export function DeliveryPin({pin,onChange}:{pin:Pin|null;onChange:(pin:Pin|null)=>void}) {
  const [enabled,setEnabled]=useState(false)
  const [failed,setFailed]=useState(false)
  const [locationStatus,setLocationStatus]=useState('')
  const locate=()=>{
    setEnabled(true)
    if(!navigator.geolocation){setLocationStatus('Tu navegador no ofrece ubicación. Elige el punto en el mapa.');return}
    setLocationStatus('Buscando tu ubicación…')
    navigator.geolocation.getCurrentPosition(position=>{
      const p={lat:position.coords.latitude,lng:position.coords.longitude};callback.current(p);mapRef.current?.setView([p.lat,p.lng],17);mapRef.current?.fire('click',{latlng:L.latLng(p.lat,p.lng)});setLocationStatus('Ubicación encontrada. Ajusta el pin al punto de entrega.')
    },()=>setLocationStatus('No pudimos obtener tu ubicación. Puedes elegir el punto manualmente.'),{enableHighAccuracy:true,timeout:10000,maximumAge:60000})
  }
  const target=useRef<HTMLDivElement>(null)
  const mapRef=useRef<L.Map|null>(null)
  const marker=useRef<L.Marker|null>(null)
  const callback=useRef(onChange);callback.current=onChange
  useEffect(()=>{
    if(!enabled||!target.current)return
    const map=L.map(target.current,{scrollWheelZoom:false}).setView(pin?[pin.lat,pin.lng]:[-2.9,-79.01],14)
    mapRef.current=map
    const layer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map)
    layer.on('tileerror',()=>setFailed(true))
    const icon=L.divIcon({className:'delivery-pin-icon',html:'<span aria-hidden="true">●</span>',iconSize:[28,28],iconAnchor:[14,14]})
    const place=(lat:number,lng:number)=>{
      if(marker.current)marker.current.setLatLng([lat,lng]);else marker.current=L.marker([lat,lng],{icon,draggable:true,title:'Punto de entrega; arrastra para ajustar'}).addTo(map).on('dragend',()=>{const p=marker.current!.getLatLng();callback.current({lat:p.lat,lng:p.lng})})
      callback.current({lat,lng})
    }
    if(pin)place(pin.lat,pin.lng)
    map.on('click',e=>place(e.latlng.lat,e.latlng.lng))
    const observer=new ResizeObserver(()=>map.invalidateSize());observer.observe(target.current)
    return()=>{observer.disconnect();map.remove();mapRef.current=null;marker.current=null}
  },[enabled])
  return <div className="delivery-pin-field"><h3>Punto de entrega · opcional</h3><p className="order-hint">La dirección y la referencia siguen siendo importantes. Abre el mapa, busca tu zona y toca donde quieres recibir el pedido.</p>
    {!enabled?<button type="button" className="glass-action" onClick={locate}>Elegir un punto en el mapa</button>:<><div ref={target} className="delivery-map" aria-label="Mapa para elegir el punto de entrega"/><button type="button" className="glass-action" onClick={()=>{const p=mapRef.current?.getCenter();if(p){callback.current({lat:p.lat,lng:p.lng});if(marker.current)marker.current.setLatLng(p);else marker.current=L.marker(p,{icon:L.divIcon({className:'delivery-pin-icon',html:'●',iconSize:[28,28],iconAnchor:[14,14]}),draggable:true,title:'Punto de entrega; arrastra para ajustar'}).addTo(mapRef.current!).on('dragend',()=>{const point=marker.current!.getLatLng();callback.current({lat:point.lat,lng:point.lng})})}}}>Usar el centro del mapa</button>{failed&&<p className="order-hint">Algunas partes del mapa no cargaron. Puedes continuar con tu dirección y referencia.</p>}</>}
    <p className="order-hint" role="status">{locationStatus}</p>{enabled&&<button type="button" className="glass-action" onClick={locate}>Usar mi ubicación actual</button>}
    {pin&&<div className="pin-result"><p>Punto elegido ✓</p><a href={`https://www.google.com/maps/search/?api=1&query=${pin.lat.toFixed(6)},${pin.lng.toFixed(6)}`} target="_blank" rel="noreferrer">Revisar punto en Google Maps ↗</a><button type="button" onClick={()=>{onChange(null);marker.current?.remove();marker.current=null}}>Quitar punto</button><small>Se mantiene solo en esta página; no se envía al restaurante.</small></div>}
  </div>
}
