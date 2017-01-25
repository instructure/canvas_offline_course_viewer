import React from 'react'
import {Link} from 'instructure-ui'

export default class ContentPage extends React.Component {

  render () {
    return <div className="body">
      <Link href="#" onClick={() => this.props.switchView('modules')}>Back to Modules</Link>
    </div>
  }
}

ContentPage.propTypes = {
  switchView: React.PropTypes.func,
}
