import React from 'react'
import I18n from 'i18n-js'
import PageHeader from './page-header'
import ModulesView from './modules-view'
import FilesView from './files-view'
import ContentPage from './content-page'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    // document.documentElement.setAttribute('lang', this.props.course.meta.language || 'en')
    document.documentElement.setAttribute('lang', this.props.course.language || 'en')

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
      return currentItem !== null
    })
    return currentItem
  }

  render () {
    let body = <ModulesView modules={this.props.course.modules} switchView={this.switchView} />
    let breadcrumb = I18n.t('Modules')
    if (this.state.currentView === 'content') {
      const moduleItem = this.findCurrentModuleItem()
      body = <ContentPage item={moduleItem} switchView={this.switchView} courseName={this.props.course.title} />
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
      </div>
    )
  }
}

App.propTypes = {
  course: React.PropTypes.object,
}
