const translations = {}

const req = require.context('../config/locales', true, /\.json$/)
req.keys().forEach((translationFile) => {
  const translation = req(translationFile)
  Object.keys(translation).forEach((key) => {
    // check for an embedded 'en' key because that's how transifex sends
    // it back to us because of how our en file is structured.
    if (translation[key]['en']) {
      translations[key] = translation[key]['en']
    } else {
      translations[key] = translation[key]
    }
  })
})

export default translations
