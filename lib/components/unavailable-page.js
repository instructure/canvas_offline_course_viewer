import React from 'react'
import I18n from 'i18n-js'
import {Alert} from 'instructure-ui'

export default class UnavailablePage extends React.Component {
  render () {
    return <Alert variant="info">
      {I18n.t(
        'This content is not available for viewing in this export. ' +
        'It will be available in future exports when this content has been unlocked online.'
      )}
    </Alert>
  }
}
