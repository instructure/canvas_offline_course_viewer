import _ from 'lodash'
import {combineReducers} from 'redux'
import {handleAction, handleActions} from 'redux-actions'
import page from 'page'
import prepareFilesStructureForView from '../util/prepare-files-structure-for-view'
import findNode from '../util/find-node'

function identity (state, action) { return action.payload }

// ----------------
// course reducers
// ----------------

function indexObjectListByExportId (objectList) {
  if (!objectList) return {}
  return objectList.reduce((hash, object) => {
    if (object.exportId) {
      hash[object.exportId.toString()] = object
    } else if (object.id) {
      hash[object.id.toString()] = object
    }
    return hash
  }, {})
}

export function indexModuleItems (modules) {
  if (!modules) return {}
  return modules.reduce((hash, module) =>
    Object.assign(hash, indexObjectListByExportId(module.items))
  , {})
}

function indexCourseDataByExportId (state, action) {
  const objects = {}
  Object.assign(objects, indexModuleItems(action.payload.modules))
  Object.assign(objects, indexObjectListByExportId(action.payload.pages))
  Object.assign(objects, indexObjectListByExportId(action.payload.assignments))
  Object.assign(objects, indexObjectListByExportId(action.payload.discussion_topics))
  Object.assign(objects, indexObjectListByExportId(action.payload.quizzes))
  return objects
}

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
//  currentFolderPath reducer
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

// -------------------
// currentView reducer
// -------------------

const switchView = handleAction('SWITCH_VIEW', identity, {viewName: 'modules', exportId: null})

// ---------------
//  final reducer
// ---------------

const reducer = combineReducers({
  course: handleAction('INITIALIZE_COURSE', identity, {}),
  structure: structureReducer,
  currentFolderPath: currentFolderReducer,
  currentView: switchView,
  content: handleAction('INITIALIZE_COURSE', indexCourseDataByExportId, {}),
})

export default reducer
