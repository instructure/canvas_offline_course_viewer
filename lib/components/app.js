import React from 'react'
import I18n from 'i18n-js'
import moment from 'moment'
import PageHeader from './page-header'
import PageFooter from './page-footer'
import ModulesView from './modules-view'
import FilesView from './files-view'
import ContentPage from './content-page'

require('./app.scss')

export default class App extends React.Component {
  constructor (props) {
    super(props)

    document.documentElement.setAttribute('lang', this.props.course.language || 'en')
    moment.locale(this.props.course.language || 'en')

    this.state = {
      currentView: 'modules',
      itemId: null,
    }

    this.switchView = this.switchView.bind(this)
  }

  switchView (view, itemId = null) {
    this.setState({currentView: view, currentItemId: itemId})
  }

  findCurrentModuleItem () {
    let currentItem = null
    this.props.course.modules.find(mod => {
      currentItem = mod.items.find(item =>
        item.id === this.state.currentItemId
      )
      return currentItem !== undefined
    })
    return currentItem
  }

  findPreviousId () {
    const previousItems = []
    let prevItemId = null
    this.props.course.modules.find(mod => {
      if (prevItemId) return true
      mod.items.find(item => {
        if (item.id === this.state.currentItemId) {
          while (!prevItemId && previousItems.length > 0) {
            const prev = previousItems.pop()
            if (prev && !prev.locked) prevItemId = prev.id
          }
          return true
        } else {
          previousItems.push(item)
        }
      })
    })
    return prevItemId
  }

  findNextId () {
    let useNext = false
    let nextItemId = null
    this.props.course.modules.find(mod => {
      if (nextItemId) return true
      mod.items.find(item => {
        if (useNext && !item.locked) {
          nextItemId = item.id
          return true
        }
        if (item.id === this.state.currentItemId) {
          useNext = true
        }
      })
    })
    return nextItemId
  }

  render () {
    let body = <ModulesView modules={this.props.course.modules} />
    let breadcrumb = I18n.t('Modules')
    if (this.state.currentView === 'content') {
      const moduleItem = this.findCurrentModuleItem()
      const prevId = this.findPreviousId()
      const nextId = this.findNextId()
      body = <ContentPage
        item={moduleItem}
        courseName={this.props.course.title}
        prevId={prevId}
        nextId={nextId} />
      breadcrumb = moduleItem.title
    } else if (this.state.currentView === 'files') {
      body = <FilesView
        course={this.props.course}
        switchView={this.switchView} />
      breadcrumb = I18n.t('Files')
    }
    return (
      <div>
        <PageHeader course={this.props.course} breadcrumb={breadcrumb} />
        {body}
        <PageFooter />
      </div>
    )
  }
}

App.propTypes = {
  course: React.PropTypes.object,
}
