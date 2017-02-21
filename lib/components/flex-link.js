import React, {PropTypes} from 'react'
import {Link} from 'instructure-ui'

export default class FlexLink extends React.Component {
  static get propTypes () {
    return {
      children: PropTypes.any,
    }
  }

  render () {
    return <Link {...this.props}>
      <div className="flex-link__wrapper" style={{display: 'flex'}}>
        {this.props.children}
      </div>
    </Link>
  }
}
