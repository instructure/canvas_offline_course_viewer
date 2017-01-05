import I18n from 'i18n-js'
import translations from 'translations'
import render from 'render'

let courseData = require('default-course-data.json')
try {
  courseData = require('course-data')
} catch (e) {} // eslint-disable-line no-empty

// i18n_js_extension expects this to be on window, so we'll oblige it
// note that webpack makes this so it isn't really on window
window.I18n = I18n
require('i18n_js_extension')

// get this copied to our dist directory
require('index.html')

I18n.defaultLocale = 'en'
I18n.locale = courseData.language
I18n.translations = translations

document.addEventListener('DOMContentLoaded', () => {
  render(courseData)
})
