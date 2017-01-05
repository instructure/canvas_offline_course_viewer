const translations = {}

const req = require.context('../config/locales', true, /\.json$/)
req.keys().forEach((translationFile) => {
  const translation = req(translationFile)
  Object.keys(translation).forEach((key) => {
    translations[key] = translation[key]
  })
})

export default translations
