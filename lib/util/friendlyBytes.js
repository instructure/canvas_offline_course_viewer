import I18n from 'i18n-js'

export default class friendlyBytes {
  friendlyBytes (value) {
    const bytes = parseInt(value, 10)
    if (bytes.toString() === 'NaN') {
      return '--'
    }
    const units = [I18n.t('byte'), I18n.t('bytes'), I18n.t('KB'), I18n.t('MB'), I18n.t('GB'), I18n.t('TB')]
    let resInt = 0
    let resValue = 0
    if (bytes !== 0) {
      resInt = Math.floor(Math.log(bytes) / Math.log(1000))
      resValue = (bytes / Math.pow(1000, Math.floor(resInt))).toFixed(resInt < 2 ? 0 : 1)
      if (bytes === 1) resInt = -1
    }
    return resValue + ' ' + units[resInt + 1]
  }
}
