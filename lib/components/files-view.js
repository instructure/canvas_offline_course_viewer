import React, {PropTypes} from 'react'
import { Alert, Transition } from 'instructure-ui'
import I18n from 'i18n-js'
import _ from 'lodash'
import TreeView from './tree-view'
import FilesList from './files-list'
import filesToTreeViewStructure from '../util/files-to-tree-view-structure'

require('./files-view.scss')

function defaultRedirector (relativePath) {
  window.location = relativePath
}

export default class FilesView extends React.Component {
  static get propTypes () {
    return {
      course: PropTypes.shape({
        files: PropTypes.arrayOf(PropTypes.object),
      }),
      redirector: React.PropTypes.func, // for testing
    }
  }

  static get defaultProps () {
    return {
      redirector: defaultRedirector,
    }
  }

  constructor (props) {
    super(props)

    this.showFolder = this.showFolder.bind(this)
    this.showFile = this.showFile.bind(this)
    this.expandNode = this.expandNode.bind(this)
    this.collapseNode = this.collapseNode.bind(this)
    this.handleDirectionsFocus = this.handleDirectionsFocus.bind(this)
    this.handleDirectionsBlur = this.handleDirectionsBlur.bind(this)
    this.handleTreeItemClick = this.handleTreeItemClick.bind(this)

    this.state = {
      files: this.props.course.files,
      folderPath: [],
      currentView: 'modules',
      structure: filesToTreeViewStructure(this.props.course.files),
      directionsFocused: false,
    }
  }

  showFolder (folder) {
    const newFolderPath = this.state.folderPath.concat(folder.name)
    this.setState({
      files: folder.files,
      folderPath: newFolderPath,
    })
  }

  showFile (file) {
    const relativePath = this.state.folderPath.concat(file.name)
    const escapedRelPath = relativePath.map((name) => encodeURIComponent(name))
    const fullRelativePath = ['viewer', 'files'].concat(escapedRelPath)
    const pathString = fullRelativePath.join('/')
    this.props.redirector(pathString)
  }

  findNode (structure, path) {
    path = _.cloneDeep(path)
    let node = structure
    while (path.length) {
      const childIndex = path.shift()
      node = node.children[childIndex]
    }
    return node
  }

  setNodeExpanded (path, expanded) {
    const newStructure = _.cloneDeep(this.state.structure)
    const toChange = this.findNode(newStructure, path)
    toChange.expanded = expanded
    this.setState({structure: newStructure})
  }

  expandNode (path) {
    this.setNodeExpanded(path, true)
  }

  collapseNode (path) {
    this.setNodeExpanded(path, false)
  }

  handleDirectionsFocus () {
    this.setState({directionsFocused: true})
  }

  handleDirectionsBlur () {
    this.setState({directionsFocused: false})
  }

  handleTreeItemClick (path) {
    const clickedNode = this.findNode(this.state.structure, path)
    console.log(`tree item ${clickedNode.label} clicked`)
  }

  render () {
    return <div className="files-view">
      <div className="files-view__directions" tabIndex="0"
        onFocus={this.handleDirectionsFocus}
        onBlur={this.handleDirectionsBlur}
        >
        <Transition
          type="slide-down"
          in={this.state.directionsFocused}
          >
          <Alert>
            {I18n.t(
              'Use the up and down arrow keys to navigate through the folder tree. \
              Press right to expand folders, left to collapse folders, \
              and enter to choose the selected item.')}
          </Alert>
        </Transition>
      </div>
      <div className="files-view__content">
        <aside className="files-view__folders">
          <TreeView
            onExpandRequested={this.expandNode}
            onCollapseRequested={this.collapseNode}
            onItemClick={this.handleTreeItemClick}
            structure={this.state.structure}
          />
        </aside>
        <div className="files-view__list">
          <FilesList
            files={this.state.files}
            onFolderClick={this.showFolder}
            onFileClick={this.showFile}
          />
        </div>
      </div>
    </div>
  }
}
