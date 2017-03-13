import React from 'react'
import I18n from 'i18n-js'
import moment from 'moment'
import {Typography} from 'instructure-ui'
import ContentArea from './content-area'

export default class AssignmentContent extends React.Component {

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
    if (['dueAt', 'unlockAt', 'lockAt'].includes(attr)) {
      return moment.parseZone(value).format('llll')
    } else if (attr === 'attempts' && value === -1) {
      return I18n.t('unlimited')
    } else if (attr === 'timeLimit') {
      return I18n.t('%{numOfMinutes} minutes', {numOfMinutes: value})
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

  includeDetails (details) {
    return details.filter(detail =>
      !!this.props.item[detail]
    ).map((detail, idx) =>
      this.addDetail(detail, idx)
    )
  }

  renderDetails () {
    const detailsToInclude = ['dueAt', 'pointsPossible', 'submissionTypes', 'unlockAt', 'lockAt']
    if (this.props.item.type === 'Quizzes::Quiz') {
      // remove submissionTypes and add others
      detailsToInclude.splice(2, 1, 'questionCount', 'timeLimit', 'attempts')
    } else if (this.props.item.type === 'DiscussionTopic') {
      // remove submissionTypes and add other
      detailsToInclude.splice(2, 1, 'graded')
    }
    return this.includeDetails(detailsToInclude)
  }

  render () {
    return <div>
      <div className="content__title">
        <Typography size="large" weight="bold">{this.props.item.title}</Typography>
      </div>
      <div className="content__details">
        {this.renderDetails()}
      </div>
      <div className="content__content">
        <ContentArea content={this.props.item.content} />
      </div>
    </div>
  }
}

AssignmentContent.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.number,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    content: React.PropTypes.text,
  }),
}
