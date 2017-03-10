import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import page from 'page'

import App from './components/app'
import reducer from './app/reducer'
import {initializeCourse, revealFolderPath} from './app/actions'

let globalStore = null

export function findItemByExportId (exportId, store = globalStore) {
  let item = null
  store.getState().course.modules.find(mod => {
    if (mod.exportId === exportId) {
      item = mod
      return true
    }
    item = mod.items.find(it =>
      it.exportId === exportId
    )
    return item !== null
  })
  return item
}

function setupRouting (appComponent) {
  if (location.protocol === 'file:') {
    const basePath = location.pathname.replace('/index.html', '')
    page.base(basePath)
  }

  page('/', '/modules')
  page('/index.html', '/modules')
  page('/modules', () => appComponent.switchView('modules'))
  page('/content/:contentId', (ctx) => appComponent.switchView('content', parseInt(ctx.params.contentId)))

  page('/modules/:exportId', (ctx) => {
    const mod = findItemByExportId(ctx.params.exportId)
    appComponent.switchView('modules', mod.id)
  })

  page('/files', (ctx) => {
    globalStore.dispatch(revealFolderPath([]))
    appComponent.switchView('files')
  })

  page('/files/*', (ctx) => {
    const folderPath = ctx.path.split('/').splice(2).map(elt => parseInt(elt))
    globalStore.dispatch(revealFolderPath(folderPath))
    appComponent.switchView('files')
  })

  page('/pages/:pageUrl', (ctx) => {
    const item = findItemByExportId(ctx.params.pageUrl)
    appComponent.switchView('content', item.id)
  })

  page('/assignments/:exportId', (ctx) => {
    const item = findItemByExportId(ctx.params.exportId)
    appComponent.switchView('content', item.id)
  })

  page('/quizzes/:exportId', (ctx) => {
    const item = findItemByExportId(ctx.params.exportId)
    appComponent.switchView('content', item.id)
  })

  page('/discussion_topics/:exportId', (ctx) => {
    const item = findItemByExportId(ctx.params.exportId)
    appComponent.switchView('content', item.id)
  })

  page({hashbang: true})
}

export default function render (courseData) {
  globalStore = createStore(reducer, applyMiddleware(createLogger()))
  globalStore.dispatch(initializeCourse(courseData))
  const elt = document.getElementById('app')
  ReactDOM.render(
    <Provider store={globalStore}>
      <App course={courseData} ref={setupRouting} />
    </Provider>
  , elt)
}
