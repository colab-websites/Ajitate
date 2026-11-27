export type Pin = { lat: number; lng: number }

export function deliveryPointUrl(pin: Pin) {
  return `https://www.google.com/maps/search/?api=1&query=${pin.lat.toFixed(6)},${pin.lng.toFixed(6)}`
}
