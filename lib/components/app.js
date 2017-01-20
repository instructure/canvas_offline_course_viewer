import React from 'react'
import PageHeader from './page-header'
import Files from './files'

export default class App extends React.Component {
  static propTypes = {
    course: React.PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.state = {
      files: this.props.course.files,
    }
    this.showFolder = this.showFolder.bind(this)
  }

  showFolder (files) {
    this.setState({files: files})
  }

  render () {
    const pageComponent = (
      <Files
        files={this.state.files}
        lang={this.props.course.language}
        onFolderClick={this.showFolder}
      />
    )
    return <div>
      <PageHeader course={this.props.course} />
      <hr />
      {pageComponent}
    </div>
  }
}
