import _ from 'lodash'
import {combineReducers} from 'redux'
import {handleAction, handleActions} from 'redux-actions'
import page from 'page'
import prepareFilesStructureForView from '../util/prepare-files-structure-for-view'
import findNode from '../util/find-node'

// -------------------
//  structure reducer
// -------------------

function setFolderExpanded (state, action, expanded) {
  const newStructure = _.cloneDeep(state)
  const folder = action.payload
  const toChange = findNode(newStructure, folder.path)
  toChange.expanded = expanded
  return newStructure
}

function revealFolderPath (state, path) {
  const newStructure = _.cloneDeep(state)
  let node = newStructure
  path.forEach((nodeIndex) => {
    node.expanded = true
    node = node.files[nodeIndex]
  })
  return newStructure
}

const structureReducer = handleActions({
  INITIALIZE_COURSE: (state, action) => prepareFilesStructureForView(action.payload),
  EXPAND_FOLDER: (state, action) => setFolderExpanded(state, action, true),
  COLLAPSE_FOLDER: (state, action) => setFolderExpanded(state, action, false),
  REVEAL_FOLDER_PATH: (state, action) => revealFolderPath(state, action.payload),
}, {})

// ---------------------------
//  currentFolderPath Reducer
// ---------------------------

function navigateToFolder (state, action) {
  page.show('/files/' + action.payload.path.join('/'))
  // no actual state change until the REVEAL_FOLDER_PATH action happens
  return state
}

// needs to keep page.js url state in sync
const currentFolderReducer = handleActions({
  // navigate will result in a subsequent REVEAL_FOLDER_PATH action
  // using separate actions to avoid mutual recursion
  NAVIGATE_TO_FOLDER: navigateToFolder,
  REVEAL_FOLDER_PATH: (state, action) => action.payload,
}, [])

// ---------------
//  final reducer
// ---------------

const reducer = combineReducers({
  course: handleAction('INITIALIZE_COURSE', undefined, {}),
  structure: structureReducer,
  currentFolderPath: currentFolderReducer,
})

export default reducer
