import React from 'react'
import PageHeader from './page-header'
import Files from './files'

export default class App extends React.Component {
  static propTypes = {
    course: React.PropTypes.object,
  }

  render () {
    const pageComponent = (
      <Files
        files={this.props.course.files}
        lang={this.props.course.language}
      />
    )
    return <div>
      <PageHeader course={this.props.course} />
      <hr />
      {pageComponent}
    </div>
  }
}
