import React from 'react'
import I18n from 'i18n-js'
import IconAssignmentSolid from 'instructure-icons/react/Solid/IconAssignmentSolid'
import IconDiscussionSolid from 'instructure-icons/react/Solid/IconDiscussionSolid'
import IconDocumentSolid from 'instructure-icons/react/Solid/IconDocumentSolid'
import IconIntegrationsSolid from 'instructure-icons/react/Solid/IconIntegrationsSolid'
import IconLinkSolid from 'instructure-icons/react/Solid/IconLinkSolid'
import IconQuizSolid from 'instructure-icons/react/Solid/IconQuizSolid'
import IconTextSolid from 'instructure-icons/react/Solid/IconTextSolid'
import IconNoteLightSolid from 'instructure-icons/react/Solid/IconNoteLightSolid'
import {Link, Typography} from 'instructure-ui'

export default class ModuleItem extends React.Component {

  constructor (props) {
    super(props)
    this.navigateToItem = this.navigateToItem.bind(this)
  }

  navigateToItem () {
    this.props.navigateToItem('content', this.props.item.id)
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
      <Typography size="x-small" color="secondary" weight="light">
        {I18n.t('%{points} pts', { points: this.props.item.pointsPossible })}
      </Typography>
    </div>
  }

  renderTitle () {
    const title = <Typography size="small" weight="bold">{this.props.item.title}</Typography>
    if (this.props.item.locked) {
      return title
    } else {
      return <Link onClick={this.navigateToItem}>{title}</Link>
    }
  }

  render () {
    return <tr className="module-item__row">
      <td>
        <div className="module-item__icon">{this.renderIcon()}</div>
        <div className="module-item__title">
          {this.renderTitle()}
          {this.renderPointsPossible()}
        </div>
        <div className="module-item__checkmark"></div>
      </td>
    </tr>
  }
}

ModuleItem.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.number,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    indent: React.PropTypes.number,
    locked: React.PropTypes.bool,
  }),
  navigateToItem: React.PropTypes.func,
}
