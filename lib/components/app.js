import React from 'react'
import I18n from 'i18n-js'
import PageHeader from './page-header'
import FilesList from './files-list'
import ModulesView from './modules-view'
import ContentPage from './content-page'

function defaultRedirector (relativePath) {
  window.location = relativePath
}

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: this.props.course.files,
      folderPath: [],
      currentView: 'modules',
    }
    this.switchView = this.switchView.bind(this)
    this.showFolder = this.showFolder.bind(this)
    this.showFile = this.showFile.bind(this)
  }

  switchView (view) {
    this.setState({currentView: view})
  }

  showFolder (folder) {
    const newFolderPath = this.state.folderPath.concat(folder.name)
    this.setState({
      files: folder.files,
      folderPath: newFolderPath,
    })
  }

  showFile (file) {
    const relativePath = this.state.folderPath.concat(file.name)
    const fullRelativePath = ['viewer', 'files'].concat(relativePath)
    const pathString = fullRelativePath.join('/')
    this.props.redirector(pathString)
  }

  render () {
    let body = <ModulesView switchView={this.switchView} />
    let breadcrumb = I18n.t('Modules')
    if (this.state.currentView === 'content') {
      body = <ContentPage switchView={this.switchView} />
      breadcrumb = 'dontknowyet'
    } else if (this.state.currentView === 'files') {
      body = <FilesList
        files={this.state.files}
        lang={this.props.course.language}
        onFolderClick={this.showFolder}
        onFileClick={this.showFile}
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
  redirector: React.PropTypes.func, // for testing
}

App.defaultProps = {
  redirector: defaultRedirector,
}
