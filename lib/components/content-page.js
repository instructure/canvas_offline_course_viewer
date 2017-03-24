import React from 'react'
import I18n from 'i18n-js'
import IconArrowOpenLeftSolid from 'instructure-icons/react/Solid/IconArrowOpenLeftSolid'
import IconArrowOpenRightSolid from 'instructure-icons/react/Solid/IconArrowOpenRightSolid'
import {Button, Link, Typography} from 'instructure-ui'
import AssignmentDetails from './assignment-details'
import ContentArea from './content-area'
import OnlineOnlyContent from './online-only-content'
import UnavailablePage from './unavailable-page'
import ExternalLinkIndicator from './external-link-indicator'
import ParticipateOnline from './participate-online'

require('./content-page.scss')

export default class ContentPage extends React.Component {
  pageAvailable () {
    return (typeof this.props.item !== 'undefined') && !this.props.item.locked
  }

  renderTitle () {
    if (!this.props.item) return null
    let title = null
    if (['WikiPage', 'Assignment', 'DiscussionTopic', 'Quizzes::Quiz'].includes(this.props.item.type)) {
      title = <div className="content__title">
        <Typography size="large" weight="bold">{this.props.item.title}</Typography>
      </div>
    }
    return title
  }

  renderParticipationWarning () {
    if (!this.props.item) return null
    return <ParticipateOnline type={this.props.item.type} />
  }

  renderAssignmentDetails () {
    let type = this.props.item && this.props.item.type
    if (type === 'DiscussionTopic' && this.props.item.graded) type = 'GradedTopic'
    if (['Assignment', 'Quizzes::Quiz', 'GradedTopic'].includes(type)) {
      return <AssignmentDetails item={this.props.item} />
    }
    return null
  }

  renderContent () {
    if (!this.pageAvailable()) {
      return <UnavailablePage />
    }
    switch (this.props.item.type) {
      case 'Attachment':
        return this.renderAttachmentLink()
      case 'ContextExternalTool':
      case 'onlineOnlyPage':
        return <div className="content__content">
          <OnlineOnlyContent />
        </div>
      case 'ExternalUrl':
        return this.renderExternalUrl()
      default:
        return <div className="content__content">
          <ContentArea content={this.props.item.content} />
        </div>
    }
  }

  renderAttachmentLink () {
    let pathStrings = this.props.item.content.split('/')
    pathStrings = pathStrings.map((pathelt) => encodeURIComponent(pathelt))
    const path = pathStrings.join('/')
    return <Link href={path}>
      {this.props.item.content.replace('viewer/files/', '')}
    </Link>
  }

  renderExternalUrl () {
    return <span>
      <Link href={this.props.item.content}>{this.props.item.title}</Link>
      <ExternalLinkIndicator />
    </span>
  }

  renderFooter () {
    let prevButton = <div className='content__empty-prev-link'></div>
    let nextButton = <div className='content__empty-next-link'></div>
    if (this.props.prevId && this.pageAvailable()) {
      prevButton = <Button
        href={`content/${this.props.prevId}`}
        size="small">
        <IconArrowOpenLeftSolid />
        <Typography size="small"> {I18n.t('Previous')}</Typography>
      </Button>
    }
    if (this.props.nextId && this.pageAvailable()) {
      nextButton = <Button
        href={`content/${this.props.nextId}`}
        size="small">
        <Typography size="small">{I18n.t('Next')} </Typography>
        <IconArrowOpenRightSolid />
      </Button>
    }
    return (
      <div className="content__footer">
        {prevButton}
        <Button
          href="modules"
          variant="primary"
          size="small"
        ><Typography size="x-small" weight="light">{this.props.courseName}</Typography></Button>
        {nextButton}
      </div>
    )
  }

  render () {
    return <div className="body content__body">
      {this.renderParticipationWarning()}
      {this.renderTitle()}
      {this.renderAssignmentDetails()}
      {this.renderContent()}
      {this.renderFooter()}
    </div>
  }
}

ContentPage.propTypes = {
  item: React.PropTypes.shape({
    exportId: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    content: React.PropTypes.text,
    locked: React.PropTypes.bool,
    graded: React.PropTypes.bool,
  }),
  courseName: React.PropTypes.string,
  prevId: React.PropTypes.string,
  nextId: React.PropTypes.string,
}
