export function strings (x, y) {
  const locale = document.documentElement.getAttribute('lang') || 'en-US'
  return x.localeCompare(y, locale, { sensitivity: 'accent', ignorePunctuation: true, numeric: true })
}

export function by (f) {
  return (x, y) => this.strings(f(x), f(y))
}

export function byKey (key) {
  return this.by(x => x[key])
}

export function byGet (key) {
  return this.by(x => x.get(key))
}

