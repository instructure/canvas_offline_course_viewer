import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import page from 'page'

import RootComponent from './components/root-component'
import reducer from './app/reducer'
import {initializeCourse, revealFolderPath, switchView} from './app/actions'

function setupRouting (store) {
  if (location.protocol === 'file:') {
    const basePath = location.pathname.replace('/index.html', '')
    page.base(basePath)
  }

  page('/', '/modules')
  page('/index.html', '/modules')
  page('/modules', () => store.dispatch(switchView('modules')))
  page('/content/:exportId', (ctx) => store.dispatch(switchView('content', ctx.params.exportId)))

  page('/modules/:exportId', (ctx) => {
    store.dispatch(switchView('modules', ctx.params.exportId))
  })

  page('/files', (ctx) => {
    store.dispatch(revealFolderPath([]))
    store.dispatch(switchView('files'))
  })

  page('/files/*', (ctx) => {
    const folderPath = ctx.path.split('/').splice(2).map(elt => parseInt(elt))
    store.dispatch(revealFolderPath(folderPath))
    store.dispatch(switchView('files'))
  })

  page('/pages/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/assignments/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/quizzes/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/discussion_topics/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page({hashbang: true})
}

export default function render (courseData) {
  const store = createStore(reducer, applyMiddleware(createLogger()))
  store.dispatch(initializeCourse(courseData))
  const elt = document.getElementById('app')
  ReactDOM.render(
    <Provider store={store}>
      <RootComponent />
    </Provider>
  , elt)
  setupRouting(store)
}
