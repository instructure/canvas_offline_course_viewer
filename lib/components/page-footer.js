import React from 'react'
import I18n from 'i18n-js'
import {Typography} from 'instructure-ui'
import {versionString} from '../app/version'

require('./page-footer.scss')

export default class PageFooter extends React.Component {
  render () {
    return <div className="page-footer">
      <Typography weight="light">
        <span className="page-footer__version-string">
          {I18n.t('version: %{versionNumber}', {versionNumber: versionString})}
        </span>
      </Typography>
    </div>
  }
}
