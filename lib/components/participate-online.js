import React from 'react'
import I18n from 'i18n-js'
import {Typography} from 'instructure-ui'
import IconInfoSolid from 'instructure-icons/react/Solid/IconInfoSolid'

export default class ParticipateOnline extends React.Component {
  getMessages () {
    switch (this.props.type) {
      case 'Assignment':
        return I18n.t('Assignments can only be submitted online.')
      case 'Quizzes::Quiz':
        return I18n.t('Quizzes can only be completed online.')
      case 'DiscussionTopic':
        return I18n.t('You can only participate in discussions online.')
      default:
        return null
    }
  }

  render () {
    if (this.props.type === 'undefined') return null
    const message = this.getMessages()
    if (message === null) return null
    return <div className="content__participate-online">
      <Typography color="brand">
        <IconInfoSolid />
      </Typography>
      <Typography size="small">{message}</Typography>
    </div>
  }
}

ParticipateOnline.propTypes = {
  type: React.PropTypes.string,
}
