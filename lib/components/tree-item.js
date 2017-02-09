import React, {PropTypes} from 'react'
import I18n from 'i18n-js'
import classNames from 'classnames'
import { Link } from 'instructure-ui'
import { IconFolderSolid, IconArrowDownSolid, IconArrowRightSolid } from 'instructure-icons'

export default class TreeItem extends React.Component {
  constructor (props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  takeFocus () {
    if (this.focusableElement) this.focusableElement.focus()
    if (this.props.simulateFocus) {
      this.handleFocus({stopPropagation: () => {}})
    }
  }

  handleKeyDown (e) {
    this.props.onItemKey(e)
  }

  handleFocus (e) {
    e.stopPropagation()
    this.props.onNewFocusedPath(this.props.structure.path)
  }

  handleButtonClick (e) {
    e.stopPropagation()
    this.props.onButtonClick(this.props.structure.path)
  }

  handleItemClick (e) {
    e.stopPropagation()
    this.props.onItemClick(this.props.structure.path)
  }

  _ariaExpanded () {
    let ariaExpanded = null
    if (this.props.structure.files.length) {
      ariaExpanded = this.props.structure.expanded
    }
    return ariaExpanded
  }

  _itemTabIndex () {
    return this.props.isFocusedPath(this.props.structure.path) ? '0' : '-1'
  }

  _renderSublist () {
    if (this.props.children.length > 0) {
      return <ul
        className="treeview__group"
        role="group"
        >
        {this.props.children}
      </ul>
    }
    return null
  }

  _renderExpansionIcon () {
    if (this.props.structure.files.length) {
      if (this.props.structure.expanded) {
        const expansionText = I18n.t('collapse tree item')
        const expansionIcon = <IconArrowDownSolid />
        return [expansionText, expansionIcon]
      } else {
        const expansionText = I18n.t('expand tree item')
        const expansionIcon = <IconArrowRightSolid />
        return [expansionText, expansionIcon]
      }
    } else {
      return [null, null]
    }
  }

  _renderExpansionButton () {
    const [expansionText, expansionIcon] = this._renderExpansionIcon()
    if (expansionText !== null) {
      return <span className="treeview__button">
        <Link
          aria-label={expansionText}
          tabIndex="-1"
          onClick={this.handleButtonClick}
          >
          {expansionIcon}
        </Link>
      </span>
    }
  }

  _renderItemIcon () {
    return <IconFolderSolid className="treeview__icon" size="small" />
  }

  _renderItemText () {
    return <span className="treeview__text">
      <Link tabIndex="-1">{this.props.structure.name}</Link>
    </span>
  }

  _renderTreeRow () {
    const rowClasses = {
      treeview__row: true,
      treeview__row__selected: this.props.isSelectedPath(this.props.structure.path),
    }

    // without the block element around this, the inline element jumps up
    // slightly when expanded and children are revealed.
    return <div><span
      className={classNames(rowClasses)}
      >
      {this._renderExpansionButton()}
      {this._renderItemIcon()}
      {this._renderItemText()}
    </span></div>
  }

  render () {
    const itemClasses = {
      treeview__item: true,
      treeview__item__leaf: this.props.structure.files.length === 0,
    }

    const itemLabel = I18n.t('%{label}, level %{treelevel}', {
      label: this.props.structure.name,
      treelevel: this.props.structure.path.length + 1,
    })

    return <li
      className={classNames(itemClasses)}
      role="treeitem"
      aria-expanded={this._ariaExpanded()}
      aria-label={itemLabel}
      ref={elt => { this.focusableElement = elt }}
      onFocus={this.handleFocus}
      onKeyDown={this.handleKeyDown}
      tabIndex={this._itemTabIndex()}
      onClick={this.handleItemClick}
      >
      {this._renderTreeRow()}
      {this._renderSublist()}
    </li>
  }
}

TreeItem.propTypes = {
  // same as tree's structure component, but contains only the sub structure for this item
  structure: PropTypes.object,

  // should be TreeItem elements
  children: PropTypes.arrayOf(PropTypes.element),

  onItemKey: PropTypes.func.isRequired,      // (e, path)
  onItemClick: PropTypes.func.isRequired,    // (path)
  onButtonClick: PropTypes.func.isRequired,  // (path)
  onNewFocusedPath: PropTypes.func.isRequired, // (path)
  isFocusedPath: PropTypes.func.isRequired,  // (path)
  isSelectedPath: PropTypes.func.isRequired,  // (path)

  // for testing
  simulateFocus: PropTypes.bool,
}
