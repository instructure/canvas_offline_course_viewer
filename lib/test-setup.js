import I18n from 'i18n-js'
window.I18n = I18n
require('../vendor/i18n_js_extension')
I18n.defaultLocale = 'en'
I18n.translations = require('../config/locales/generated/en.json')
