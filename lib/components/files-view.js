import React, {PropTypes} from 'react'
import { Alert, Transition } from 'instructure-ui'
import I18n from 'i18n-js'
import {connect} from 'react-redux'
import findNode from '../util/find-node'
import TreeView from './tree-view'
import FilesList from './files-list'
import * as actions from '../app/actions'

require('./files-view.scss')

export class FilesView extends React.Component {
  static get propTypes () {
    return {
      reduxState: PropTypes.object,
      // declare actions this component can dispatch
      expandFolder: React.PropTypes.func, // (folder)
      collapseFolder: React.PropTypes.func, // (folder)
      navigateToFolder: React.PropTypes.func, // (folder)
    }
  }

  constructor (props) {
    super(props)

    this.handleDirectionsFocus = this.handleDirectionsFocus.bind(this)
    this.handleDirectionsBlur = this.handleDirectionsBlur.bind(this)

    this.state = {
      directionsFocused: false,
    }
  }

  currentFolderPathToPathStringArray () {
    let currentFolder = this.props.reduxState.structure
    const relativeFolderPath = this.props.reduxState.currentFolderPath.map((folderIndex) => {
      currentFolder = currentFolder.files[folderIndex]
      return currentFolder.name
    })
    return ['viewer', 'files'].concat(relativeFolderPath)
  }

  handleDirectionsFocus () {
    this.setState({directionsFocused: true})
  }

  handleDirectionsBlur () {
    this.setState({directionsFocused: false})
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
              'Use the up and down arrow keys to navigate through the folder tree. ' +
              'Press right to expand folders, left to collapse folders, ' +
              'and enter to choose the selected item.'
            )}
          </Alert>
        </Transition>
      </div>
      <div className="files-view__content">
        <aside className="files-view__folders">
          <TreeView
            onExpandRequested={this.props.expandFolder}
            onCollapseRequested={this.props.collapseFolder}
            onItemClick={this.props.navigateToFolder}
            structure={this.props.reduxState.structure}
            selectedPath={this.props.reduxState.currentFolderPath}
          />
        </aside>
        <div className="files-view__list">
          <FilesList
            files={findNode(this.props.reduxState.structure, this.props.reduxState.currentFolderPath).files}
            onFolderClick={this.props.navigateToFolder}
            fileLinkPrefix={this.currentFolderPathToPathStringArray()}
          />
        </div>
      </div>
    </div>
  }
}

export default connect(reduxState => ({reduxState}), actions)(FilesView)
