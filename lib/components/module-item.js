import React from 'react'
import I18n from 'i18n-js'
import IconAssignmentSolid from 'instructure-icons/react/Solid/IconAssignmentSolid'
import IconDiscussionSolid from 'instructure-icons/react/Solid/IconDiscussionSolid'
import IconDocumentSolid from 'instructure-icons/react/Solid/IconDocumentSolid'
import IconIntegrationsSolid from 'instructure-icons/react/Solid/IconIntegrationsSolid'
import IconLinkSolid from 'instructure-icons/react/Solid/IconLinkSolid'
import IconQuizSolid from 'instructure-icons/react/Solid/IconQuizSolid'
import IconTextSolid from 'instructure-icons/react/Solid/IconTextSolid'
import {Typography} from 'instructure-ui'

export default class ModuleItem extends React.Component {

  renderIcon () {
    if (this.props.item.type === 'assignment') {
      return <IconAssignmentSolid />
    } else if (this.props.item.type === 'quiz') {
      return <IconQuizSolid />
    } else if (this.props.item.type === 'discussion') {
      return <IconDiscussionSolid />
    } else if (this.props.item.type === 'text') {
      return <IconTextSolid />
    } else if (this.props.item.type === 'url') {
      return <IconLinkSolid />
    } else if (this.props.item.type === 'tool') {
      return <IconIntegrationsSolid />
    } else if (this.props.item.type === 'file') {
      return <IconDocumentSolid />
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

  render () {
    return <tr className="module-item__row">
      <td>
        <div className="module-item__icon">{this.renderIcon()}</div>
        <div className="module-item__title">
          <Typography size="small">{this.props.item.title}</Typography>
          {this.renderPointsPossible()}
        </div>
        <div className="module-item__checkmark"></div>
      </td>
    </tr>
  }
}

ModuleItem.propTypes = {
  item: React.PropTypes.shape({
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    indent: React.PropTypes.number,
  }),
}
