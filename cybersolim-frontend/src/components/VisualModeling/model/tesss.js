export function GetQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  let s = window.location.search
  let href = window.location.href
  let index = href.indexOf('?')
  if (s === '') {
    r = href.substr(index + 1).match(reg)
  }
  if (r !== null) return unescape(r[2])
  return null
}
