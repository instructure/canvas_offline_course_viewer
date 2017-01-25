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
    }

    this.switchView = this.switchView.bind(this)
  }

  switchView (view) {
    this.setState({currentView: view})
  }

  render () {
    let body = <ModulesView modules={this.props.course.modules} switchView={this.switchView} />
    let breadcrumb = I18n.t('Modules')
    if (this.state.currentView === 'content') {
      body = <ContentPage switchView={this.switchView} />
      breadcrumb = 'dontknowyet'
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
