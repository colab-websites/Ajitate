export function formatPhone(value: string) {
  const entered = value.trim()
  const digits = entered.replace(/\D/g, '')
  if (/^\+?[\d\s().-]+$/.test(entered)) {
    if (/^593\d{9}$/.test(digits)) {
      return `+593 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`
    }
    if (!entered.startsWith('+') && /^0\d{9}$/.test(digits)) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    }
  }
  return entered
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return /^\+?[\d\s().-]+$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15
}
