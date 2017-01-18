import React, {PropTypes} from 'react'
import { Alert, Transition } from 'instructure-ui'
import I18n from 'i18n-js'
import _ from 'lodash'
import shortid from 'shortid'
import TreeView from './tree-view'
import FilesList from './files-list'

require('./files-view.scss')

function defaultRedirector (relativePath) {
  window.location = relativePath
}

export default class FilesView extends React.Component {
  static get propTypes () {
    return {
      course: PropTypes.object.isRequired,
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
      structure: exampleStructure,
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
    const fullRelativePath = ['viewer', 'files'].concat(relativePath)
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

const exampleStructure = {
  key: shortid(),
  label: 'root',
  expanded: true,
  children: [{
    key: shortid(),
    label: 'flora',
    expanded: false,
    children: [{
      key: shortid(),
      label: 'herbs',
      expanded: false,
      children: [{
        key: shortid(),
        label: 'sage',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'rosemary',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'thyme',
        expanded: false,
        children: [],
      }],
    }, {
      key: shortid(),
      label: 'flowers',
      expanded: false,
      children: [{
        key: shortid(),
        label: 'daisy',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'poppy',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'rose',
        expanded: false,
        children: [],
      }],
    }],
  }, {
    key: shortid(),
    label: 'fauna',
    expanded: false,
    children: [{
      key: shortid(),
      label: 'mammals',
      expanded: false,
      children: [{
        key: shortid(),
        label: 'elephant',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'monkey',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'whale',
        expanded: false,
        children: [],
      }],
    }, {
      key: shortid(),
      label: 'reptiles',
      expanded: false,
      children: [{
        key: shortid(),
        label: 'lizard',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'snake',
        expanded: false,
        children: [],
      }, {
        key: shortid(),
        label: 'turtle',
        expanded: false,
        children: [],
      }],
    }],
  }],
}
