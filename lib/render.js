import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

export default function render (courseData) {
  const elt = document.getElementById('app')
  ReactDOM.render(
    <App course={courseData} />, elt
  )
}
