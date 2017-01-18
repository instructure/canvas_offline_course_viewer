import React from 'react'
import I18n from 'i18n-js'
import PageHeader from './page-header'
import Files from './files'
import ModulesView from './modules-view'
import ContentPage from './content-page'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: this.props.course.files,
      currentView: 'modules',
    }
    this.switchView = this.switchView.bind(this)
    this.showFolder = this.showFolder.bind(this)
  }

  switchView (view) {
    this.setState({currentView: view})
  }

  showFolder (files) {
    this.setState({files: files})
  }

  render () {
    let body = <ModulesView switchView={this.switchView} />
    let breadcrumb = I18n.t('Modules')
    if (this.state.currentView === 'content') {
      body = <ContentPage switchView={this.switchView} />
      breadcrumb = 'dontknowyet'
    } else if (this.state.currentView === 'files') {
      body = <Files
        files={this.props.course.files}
        lang={this.props.course.language}
        onFolderClick={this.showFolder}
        switchView={this.switchView} />
      breadcrumb = I18n.t('Files')
    }
    return (
      <div>
        <PageHeader course={this.props.course} breadcrumb={breadcrumb} />
        <hr />
        {body}
      </div>
    )
  }
}

App.propTypes = {
  course: React.PropTypes.object,
}

export default App
