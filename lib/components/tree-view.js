import React, {PropTypes} from 'react'
import _ from 'lodash'
import TreeItem from './tree-item'
import I18n from 'i18n-js'
import findNode from '../util/find-node'

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
    this.handleNewFocusedFolder = this.handleNewFocusedFolder.bind(this)
    this.isFocusedPath = this.isFocusedPath.bind(this)
    this.isSelectedPath = this.isSelectedPath.bind(this)
    this.handleFocus = this.handleFocus.bind(this)

    this.state = {
      focusedFolder: this.props.structure,
    }

    this.treeItems = new Map()
  }

  handleNewFocusedPath (path) {
    this.handleNewFocusedFolder(findNode(this.props.structure, path))
  }

  handleNewFocusedFolder (folder) {
    this.setState({focusedFolder: folder})
  }

  getFocusedPath () {
    return this.state.focusedFolder.path
  }

  isFocusedPath (path) {
    return _.isEqual(this.state.focusedFolder.path, path)
  }

  isSelectedPath (path) {
    return _.isEqual(this.props.selectedPath, path)
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

  _focusNextTreeItem (folder) {
    const next = this._nextVisibleTreeItem(folder.path)
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

  _focusPriorTreeItem (folder) {
    const prior = this._priorTreeItem(folder.path)
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

  _keyboardCollapseNode (folder) {
    const treeItem = this._getTreeItem(folder.path)
    if (treeItem.props.structure.files.length === 0) {
      this._focusParentTreeItem(folder.path)
    } else if (!treeItem.props.structure.expanded) {
      this._focusParentTreeItem(folder.path)
    } else if (this.props.onCollapseRequested) {
      this.props.onCollapseRequested(folder)
    }
  }

  _keyboardExpandNode (folder) {
    const treeItem = this._getTreeItem(folder.path)
    if (treeItem.props.structure.files.length === 0) return

    if (folder.path.length === 0) {
      this._focusNextTreeItem(folder)
    } if (treeItem.props.structure.expanded) {
      this._focusNextTreeItem(folder)
    } else if (this.props.onExpandRequested) {
      this.props.onExpandRequested(folder)
    }
  }

  takeFocus () {
    this.focusableElement.focus()
    if (this.props.simulateFocus) {
      this.handleFocus()
    }
  }

  handleFocus () {
    this.setState({focusedFolder: this.props.structure})
  }

  handleItemClick (folder) {
    if (this.props.onItemClick) {
      this.props.onItemClick(folder)
    }
  }

  handleItemKey (e) {
    const focusedFolder = this.state.focusedFolder
    let handled = false
    if (e.key === 'ArrowDown') {
      this._focusNextTreeItem(focusedFolder)
      handled = true
    } else if (e.key === 'ArrowUp') {
      this._focusPriorTreeItem(focusedFolder)
      handled = true
    } else if (e.key === 'ArrowLeft') {
      this._keyboardCollapseNode(focusedFolder)
      handled = true
    } else if (e.key === 'ArrowRight') {
      this._keyboardExpandNode(focusedFolder)
      handled = true
    } else if (e.key === 'Enter' || e.key === ' ') {
      this.handleItemClick(focusedFolder)
      handled = true
    }

    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleButtonClick (folder) {
    const treeItem = this._getTreeItem(folder.path)
    const expanded = treeItem.props.structure.expanded
    if (expanded && this.props.onCollapseRequested) {
      this.props.onCollapseRequested(folder)
    } else if (!expanded && this.props.onExpandRequested) {
      this.props.onExpandRequested(folder)
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
      onNewFocusedFolder: this.handleNewFocusedFolder,
      isFocusedPath: this.isFocusedPath,
      isSelectedPath: this.isSelectedPath,
      simulateFocus: this.props.simulateFocus,
    }
  }

  render () {
    return <ul
      className="treeview__top treeview__group"
      ref={ul => { this.focusableElement = ul }}
      role="tree"
      aria-label={I18n.t('folder tree')}
      tabIndex={this.state.focusedFolder.path.length === 0 ? '0' : '-1'}
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

    // path to this node
    path: PropTypes.arrayOf(PropTypes.number),

    // an array of this same structure. Should be an empty array if no children.
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,

  // The currently selected path. Maybe be undefined for no selection
  selectedPath: PropTypes.arrayOf(PropTypes.number),

  // event parameter is an array of indexes to the node that is requesting the state change
  onExpandRequested: PropTypes.func, // f(folder)
  onCollapseRequested: PropTypes.func, // f(folder)
  onItemClick: PropTypes.func, // f(folder)

  // for testing
  simulateFocus: PropTypes.bool,
}
