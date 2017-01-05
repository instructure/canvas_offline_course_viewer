import React from 'react'
import PageHeader from './page-header'

export default class App extends React.Component {
  static propTypes = {
    course: React.PropTypes.object,
  }

  render () {
    return <div>
      <PageHeader course={this.props.course} />
      <hr />
    </div>
  }
}
