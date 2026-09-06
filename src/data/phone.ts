export function formatPhone(value:string) {
  const digits=value.replace(/\D/g,'').slice(0,13)
  const international=digits.startsWith('593')
  const local=international?digits.slice(3):digits
  const first=international?2:3
  const parts=[local.slice(0,first),local.slice(first,first+3),local.slice(first+3,first+7)]
  return `${international?'+593 ':''}${parts[0]?`(${parts[0]}${parts[0].length===first?')':''}`:''}${parts[1]?' '+parts[1]:''}${parts[2]?'-'+parts[2]:''}`
}
