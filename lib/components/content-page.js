import React from 'react'
import AssignmentContent from './assignment-content'
import {Button, Typography} from 'instructure-ui'

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
          <Typography weight="light">{this.props.item.content}</Typography>
        </div>
    }
  }

  render () {
    return <div className="body content__body">
      {this.renderContent()}
      <div className="content__footer">
        <Button
          variant="primary"
          size="small"
          onClick={() => this.props.switchView('modules')}
        ><Typography size="x-small" weight="light">{this.props.courseName}</Typography></Button>
      </div>
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
  switchView: React.PropTypes.func,
  courseName: React.PropTypes.string,
}
