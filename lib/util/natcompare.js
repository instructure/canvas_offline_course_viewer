export default class NatCompare {
  strings (x, y) {
    const locale = document.documentElement.getAttribute('lang') || 'en-US'
    x.localCompare(y, locale, { sensitivity: 'accent', ignorePunctuation: true, numeric: true })
  }

  by (f) {
    return (x, y) => this.strings(f(x), f(y))
  }

  byKey (key) {
    return this.by(x => x[key])
  }

  byGet (key) {
    return this.by(x => x.get(key))
  }
}
