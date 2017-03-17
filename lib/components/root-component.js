import React from 'react'
import {connect} from 'react-redux'
import App from './app'
import * as actions from '../app/actions'

class RootComponent extends React.Component {
  static get propTypes () {
    return {
      reduxState: React.PropTypes.object,
    }
  }
  render () {
    return <App
      course={this.props.reduxState.course}
      viewName = {this.props.reduxState.currentView.viewName}
      exportId = {this.props.reduxState.currentView.exportId}
      content={this.props.reduxState.content}
    />
  }
}

export default connect(reduxState => ({reduxState}), actions)(RootComponent)
