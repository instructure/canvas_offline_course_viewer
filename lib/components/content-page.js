import React from 'react'
import I18n from 'i18n-js'
import IconArrowOpenLeftSolid from 'instructure-icons/react/Solid/IconArrowOpenLeftSolid'
import IconArrowOpenRightSolid from 'instructure-icons/react/Solid/IconArrowOpenRightSolid'
import {Button, Typography} from 'instructure-ui'
import AssignmentContent from './assignment-content'
import ContentArea from './content-area'

require('./content-page.scss')

export default class ContentPage extends React.Component {
  renderContent () {
    switch (this.props.item.type) {
      case 'Assignment':
      case 'Quizzes::Quiz':
      case 'DiscussionTopic':
        return <AssignmentContent item={this.props.item} />
      default:
        return <div className="content__content">
          <ContentArea content={this.props.item.content} />
        </div>
    }
  }

  renderFooter () {
    let prevButton = <div className='content__empty-prev-link'></div>
    let nextButton = <div className='content__empty-next-link'></div>
    if (this.props.prevId) {
      prevButton = <Button
        href={`content/${this.props.prevId}`}
        size="small">
        <IconArrowOpenLeftSolid />
        <Typography size="small"> {I18n.t('Previous')}</Typography>
      </Button>
    }
    if (this.props.nextId) {
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
      {this.renderContent()}
      {this.renderFooter()}
    </div>
  }
}

ContentPage.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.number,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    content: React.PropTypes.text,
  }),
  courseName: React.PropTypes.string,
  prevId: React.PropTypes.number,
  nextId: React.PropTypes.number,
}
