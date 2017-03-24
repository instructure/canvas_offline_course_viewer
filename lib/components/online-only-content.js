import React from 'react'
import I18n from 'i18n-js'
import {Alert} from 'instructure-ui'

export default class OnlineOnlyContent extends React.Component {
  render () {
    return <Alert variant="info">
      {I18n.t('This page is not available offline. ' +
      'To view this page, please visit your course online.')}
    </Alert>
  }
}
