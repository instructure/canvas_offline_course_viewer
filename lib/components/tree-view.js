import React, {PropTypes} from 'react'
import _ from 'lodash'
import TreeItem from './tree-item'
import I18n from 'i18n-js'

require('./tree-view.scss')

function createTreeItemStructure (structure, callbacks, refCallback) {
  let children = []
  if (structure.expanded) {
    children = structure.files.reduce((acc, child, index) => {
      if (child.type !== 'folder') return acc
      return acc.concat(createTreeItemStructure(child, callbacks, refCallback))
    }, [])
  }

  const boundRefCallback = treeItem => refCallback(structure.path, treeItem)
  return [<TreeItem
    {...callbacks}
    ref={boundRefCallback}
    key={structure.key}
    structure={structure}
    >
    {children}
  </TreeItem>]
}

export default class TreeView extends React.Component {
  constructor (props) {
    super(props)

    this._recordTreeItemInstance = this._recordTreeItemInstance.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleItemKey = this.handleItemKey.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleNewFocusedPath = this.handleNewFocusedPath.bind(this)
    this.isFocusedPath = this.isFocusedPath.bind(this)
    this.handleFocus = this.handleFocus.bind(this)

    this.state = {focusedPath: []}

    this.treeItems = new Map()
  }

  handleNewFocusedPath (path) {
    this.setState({focusedPath: path})
  }

  getFocusedPath () {
    return this.state.focusedPath
  }

  isFocusedPath (path) {
    return _.isEqual(this.state.focusedPath, path)
  }

  _recordTreeItemInstance (path, treeItem) {
    this.treeItems.set(path.join(), treeItem)
  }

  _getTreeItem (path) {
    return this.treeItems.get(path.join())
  }

  _findRelevantTreeItems (path) {
    const child = this._getTreeItem(path)
    const childIndex = path[path.length - 1]
    const parentPath = path.slice(0, path.length - 1)
    const parent = this._getTreeItem(parentPath)
    return {child, childIndex, parent, parentPath}
  }

  _focusNextTreeItem (path) {
    const next = this._nextVisibleTreeItem(path)
    if (next) next.takeFocus()
  }

  _nextVisibleTreeItem (path) {
    const {child} = this._findRelevantTreeItems(path)

    // next is first child, if any
    if (child.props.structure.files.length > 0) {
      const firstChild = this._getTreeItem(path.concat([0]))
      if (firstChild) return firstChild
    }
    return this._nextVisibleSiblingOrParentItem(path)
  }

  _nextVisibleSiblingOrParentItem (path) {
    if (path.length === 0) return null

    const {childIndex, parent, parentPath} = this._findRelevantTreeItems(path)
    // next sibling?
    if (childIndex < parent.props.structure.files.length - 1) {
      return this._getTreeItem(parentPath.concat([childIndex + 1]))
    }

    // parent's next sibling
    return this._nextVisibleSiblingOrParentItem(parentPath)
  }

  _focusPriorTreeItem (path) {
    const prior = this._priorTreeItem(path)
    if (prior) prior.takeFocus()
  }

  _priorTreeItem (path) {
    const {parent, parentPath, childIndex} = this._findRelevantTreeItems(path)
    if (childIndex === 0) {
      return parent
    }
    return this._lastDeepestVisibleChildItem(parentPath.concat([childIndex - 1]))
  }

  _lastDeepestVisibleChildItem (path) {
    let treeItemPath = path
    let treeItem = this._getTreeItem(path)
    let _priorTreeItem = treeItem
    while (treeItem && treeItem.props.structure.files.length > 0) {
      const lastChildIndex = treeItem.props.structure.files.length - 1
      treeItemPath = treeItemPath.concat([lastChildIndex])
      _priorTreeItem = treeItem
      treeItem = this._getTreeItem(treeItemPath)
    }
    if (!treeItem) return _priorTreeItem
    return treeItem
  }

  _focusParentTreeItem (path) {
    const {parent} = this._findRelevantTreeItems(path)
    parent.takeFocus()
  }

  _keyboardCollapseNode (path) {
    const treeItem = this._getTreeItem(path)
    if (treeItem.props.structure.files.length === 0) {
      this._focusParentTreeItem(path)
    } else if (!treeItem.props.structure.expanded) {
      this._focusParentTreeItem(path)
    } else if (this.props.onCollapseRequested) {
      this.props.onCollapseRequested(path)
    }
  }

  _keyboardExpandNode (path) {
    const treeItem = this._getTreeItem(path)
    if (treeItem.props.structure.files.length === 0) return

    if (path.length === 0) {
      this._focusNextTreeItem(path)
    } if (treeItem.props.structure.expanded) {
      this._focusNextTreeItem(path)
    } else if (this.props.onExpandRequested) {
      this.props.onExpandRequested(path)
    }
  }

  takeFocus () {
    this.focusableElement.focus()
    if (this.props.simulateFocus) {
      this.handleFocus()
    }
  }

  handleFocus () {
    this.setState({focusedPath: []})
  }

  handleItemClick (path) {
    if (this.props.onItemClick) {
      this.props.onItemClick(path)
    }
  }

  handleItemKey (e) {
    const path = this.getFocusedPath()
    let handled = false
    if (e.key === 'ArrowDown') {
      this._focusNextTreeItem(path)
      handled = true
    } else if (e.key === 'ArrowUp') {
      this._focusPriorTreeItem(path)
      handled = true
    } else if (e.key === 'ArrowLeft') {
      this._keyboardCollapseNode(path)
      handled = true
    } else if (e.key === 'ArrowRight') {
      this._keyboardExpandNode(path)
      handled = true
    } else if (e.key === 'Enter' || e.key === ' ') {
      this.handleItemClick(path)
      handled = true
    }

    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleButtonClick (path) {
    const treeItem = this._getTreeItem(path)
    const expanded = treeItem.props.structure.expanded
    if (expanded && this.props.onCollapseRequested) {
      this.props.onCollapseRequested(path)
    } else if (!expanded && this.props.onExpandRequested) {
      this.props.onExpandRequested(path)
    }
  }

  handleKeyDown (e) {
    this.handleItemKey(e, [])
  }

  _treeItemCallbacks () {
    return {
      onItemClick: this.handleItemClick,
      onButtonClick: this.handleButtonClick,
      onItemKey: this.handleItemKey,
      onNewFocusedPath: this.handleNewFocusedPath,
      isFocusedPath: this.isFocusedPath,
      simulateFocus: this.props.simulateFocus,
    }
  }

  render () {
    return <ul
      className="treeview__top treeview__group"
      ref={ul => { this.focusableElement = ul }}
      role="tree"
      aria-label={I18n.t('folder tree')}
      tabIndex={this.state.focusedPath.length === 0 ? '0' : '-1'}
      onFocus={this.handleFocus}
      onKeyDown={this.handleKeyDown}
      >
      {createTreeItemStructure(this.props.structure, this._treeItemCallbacks(), this._recordTreeItemInstance)}
    </ul>
  }
}

TreeView.propTypes = {
  // Tree hierarchy data structure.
  structure: PropTypes.shape({
    // unique id for this node (in the whole tree)
    key: PropTypes.string.isRequired,

    // only folders are rendered in the tree. files are ignored.
    type: PropTypes.oneOf(['folder', 'file']),

    // label appearing in the tree for this item - generally just text
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

    // whether this node is expanded. children of unexpanded nodes are not rendered.
    expanded: PropTypes.bool.isRequired,

    // an array of this same structure. Should be an empty array if no children.
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,

  // event parameter is an array of indexes to the node that is requesting the state change
  onExpandRequested: PropTypes.func, // f(path)
  onCollapseRequested: PropTypes.func, // f(path)
  onItemClick: PropTypes.func, // f(path)

  // for testing
  simulateFocus: PropTypes.bool,
}
