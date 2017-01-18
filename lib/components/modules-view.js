import React from 'react'
import I18n from 'i18n-js'
import {Link} from 'instructure-ui'

export default class ModulesView extends React.Component {

  render () {
    return <div>
      <Link href="#" onClick={() => this.props.switchView('files')}>{I18n.t('Files')}</Link>
    </div>
  }
}

ModulesView.propTypes = {
  switchView: React.PropTypes.func,
}
