import React from 'react'
import I18n from 'i18n-js'
import moment from 'moment'
import {Typography} from 'instructure-ui'

export default class AssignmentDetails extends React.Component {

  constructor (props) {
    super(props)
    this.attributeTextMapping = {
      'dueAt': <Typography weight="bold">{I18n.t('Due')}</Typography>,
      'pointsPossible': <Typography weight="bold">{I18n.t('Points')}</Typography>,
      'submissionTypes': <Typography weight="bold">{I18n.t('Submitting')}</Typography>,
      'unlockAt': <span>
          <Typography weight="bold">{I18n.t('Available')}</Typography>
          <Typography> {I18n.t('after')}</Typography>
        </span>,
      'lockAt': <span>
          <Typography weight="bold">{I18n.t('Available')}</Typography>
          <Typography> {I18n.t('until')}</Typography>
        </span>,
      'questionCount': <Typography weight="bold">{I18n.t('Questions')}</Typography>,
      'timeLimit': <Typography weight="bold">{I18n.t('Time Limit')}</Typography>,
      'attempts': <Typography weight="bold">{I18n.t('Allowed Attempts')}</Typography>,
      'graded': <Typography weight="bold">{I18n.t('This is a graded discussion')}</Typography>,
    }
  }

  formatValue (attr, value) {
    if (attr === 'dueAt' && value === null) {
      return I18n.t('No Due Date')
    } else if (['dueAt', 'unlockAt', 'lockAt'].includes(attr)) {
      return moment.parseZone(value).format('llll')
    } else if (attr === 'attempts' && value === -1) {
      return I18n.t('unlimited')
    } else if (attr === 'timeLimit' && value === null) {
      return I18n.t('None')
    } else if (attr === 'timeLimit') {
      return I18n.t('%{numOfMinutes} minutes', {numOfMinutes: value})
    } else if (attr === 'pointsPossible' && value === undefined) {
      return I18n.t('None')
    } else if (attr === 'pointsPossible' && value === null) {
      return 0
    } else return value
  }

  addDetail (attr, index) {
    if (attr === 'graded') {
      return <div key={index}>
        {this.attributeTextMapping[attr]}
      </div>
    } else {
      return <div key={index}>
        {this.attributeTextMapping[attr]}
        <Typography> {this.formatValue(attr, this.props.item[attr])}</Typography>
      </div>
    }
  }

  renderDetails () {
    // The order of details is used directly in the display
    const item = this.props.item
    const details = ['dueAt', 'pointsPossible']
    if (item.type === 'Assignment' && item['submissionTypes']) details.push('submissionTypes')
    if (item.type === 'Quizzes::Quiz') details.push('questionCount', 'timeLimit', 'attempts')
    if (item.type === 'DiscussionTopic') details.push('graded')
    if (item['unlockAt']) details.push('unlockAt')
    if (item['lockAt']) details.push('lockAt')
    return details.map((detail, idx) =>
      this.addDetail(detail, idx)
    )
  }

  render () {
    return <div className="content__details">
        {this.renderDetails()}
      </div>
  }
}

AssignmentDetails.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.number,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    content: React.PropTypes.text,
  }),
}
