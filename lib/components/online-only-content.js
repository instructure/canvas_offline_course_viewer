import React from 'react'
import I18n from 'i18n-js'
import {Typography} from 'instructure-ui'

export default class OnlineOnlyContent extends React.Component {
  render () {
    return <Typography weight='light'>
      {I18n.t('This content is only available online')}
    </Typography>
  }
}
