import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import page from '../vendor/modified-page'
import './util/theme'

import RootComponent from './components/root-component'
import reducer from './app/reducer'
import {initializeCourse, revealFolderPath, switchView} from './app/actions'

function setupRouting (store) {
  if (location.protocol === 'file:') {
    const basePath = location.pathname
      .replace('/index.html', '')     // strip the file name
      .replace(/^\/[a-zA-Z]:\//, '/') // strip the windows drive letter
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

  page('/pages/', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/pages/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/wiki/', (ctx) => {
    store.dispatch(switchView('content', 'frontPage'))
  })

  page('/wiki/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/assignments', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/assignments/syllabus', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/assignments/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/quizzes', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/quizzes/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/discussion_topics', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/discussion_topics/:exportId', (ctx) => {
    store.dispatch(switchView('content', ctx.params.exportId))
  })

  page('/announcements', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/announcements/:id', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/grades', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/users', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/collaborations', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/conferences', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/external_tools/:id', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  page('/external_tools', (ctx) => {
    store.dispatch(switchView('onlineOnlyPage'))
  })

  // open file links in a new window
  // this is important because the bfcache in some browsers (windows firefox)
  // breaks the app because page.js stops itself on unhandled urls
  page('/viewer/files/*', (ctx) => {
    window.open(ctx.path.replace(/^\//, ''))
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
