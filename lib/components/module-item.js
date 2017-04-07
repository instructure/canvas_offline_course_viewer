import React from 'react'
import I18n from 'i18n-js'
import IconCompleteSolid from 'instructure-icons/react/Solid/IconCompleteSolid'
import IconAssignmentSolid from 'instructure-icons/react/Solid/IconAssignmentSolid'
import IconDiscussionSolid from 'instructure-icons/react/Solid/IconDiscussionSolid'
import IconDocumentSolid from 'instructure-icons/react/Solid/IconDocumentSolid'
import IconIntegrationsSolid from 'instructure-icons/react/Solid/IconIntegrationsSolid'
import IconLinkSolid from 'instructure-icons/react/Solid/IconLinkSolid'
import IconQuizSolid from 'instructure-icons/react/Solid/IconQuizSolid'
import IconTextSolid from 'instructure-icons/react/Solid/IconTextSolid'
import IconNoteLightSolid from 'instructure-icons/react/Solid/IconNoteLightSolid'
import {Link, Typography, ScreenReaderContent} from 'instructure-ui'
import classNames from 'classnames'
import ExternalLinkIndicator from './external-link-indicator'

export default class ModuleItem extends React.Component {

  renderCompleted () {
    if (this.props.item.completed) {
      return <div className="module-item__checkmark">
        <ScreenReaderContent>
          {I18n.t('%{assignmentName} has been completed', {assignmentName: this.props.item.title})}
        </ScreenReaderContent>
        <IconCompleteSolid />
      </div>
    } else {
      return null
    }
  }

  renderIcon () {
    if (this.props.item.type === 'Assignment') {
      return <IconAssignmentSolid />
    } else if (this.props.item.type === 'Quizzes::Quiz') {
      return <IconQuizSolid />
    } else if (this.props.item.type === 'DiscussionTopic') {
      return <IconDiscussionSolid />
    } else if (this.props.item.type === 'ExternalUrl') {
      return <IconLinkSolid />
    } else if (this.props.item.type === 'ContextExternalTool') {
      return <IconIntegrationsSolid />
    } else if (this.props.item.type === 'Attachment') {
      return <IconDocumentSolid />
    } else if (this.props.item.type === 'ContextModuleSubHeader') {
      return <IconTextSolid />
    } else if (this.props.item.type === 'WikiPage') {
      return <IconNoteLightSolid />
    }
  }

  renderPointsPossible () {
    if (!this.props.item.pointsPossible) return null
    return <div className="module-item__points-possible">
      <Typography size="x-small">
        {I18n.t('%{points} pts', { points: this.props.item.pointsPossible })}
      </Typography>
    </div>
  }

  renderTitle () {
    const title = <Typography size="small" weight="bold">{this.props.item.title}</Typography>
    if (this.props.item.locked || this.props.item.type === 'ContextModuleSubHeader') {
      return title
    } else {
      const contentId = this.props.item.exportId || this.props.item.id
      let href = `content/${contentId}`
      let target = null
      if (this.props.item.type === 'ExternalUrl') {
        href = this.props.item.content
        target = '_blank'
      }
      return <Link href={href} target={target}>{title}</Link>
    }
  }

  renderExternalLinkIndicator () {
    if (this.props.item.type === 'ExternalUrl') {
      return <ExternalLinkIndicator />
    }
  }

  render () {
    const rowClasses = {
      'module-item__row': true,
      'module-item__row__locked': this.props.item.locked === true,
      'module-item__text-only': this.props.item.type === 'ContextModuleSubHeader',
    }

    return <tr className={classNames(rowClasses)}>
      <td>
        <div className="module-item__row-contents">
          <div className={`module-item__icon module-item__indent-${this.props.item.indent}`}>
            {this.renderIcon()}
          </div>
          <div className="module-item__title">
          <span className="module-item__title_wrapper">
            {this.renderTitle()}
            {this.renderExternalLinkIndicator()}
          </span>
          {this.renderPointsPossible()}
          </div>
          {this.renderCompleted()}
        </div>
      </td>
    </tr>
  }
}

ModuleItem.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.number,
    exportId: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    content: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    indent: React.PropTypes.number,
    locked: React.PropTypes.bool,
  }),
}
