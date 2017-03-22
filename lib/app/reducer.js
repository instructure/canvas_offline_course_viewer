import _ from 'lodash'
import {combineReducers} from 'redux'
import {handleAction, handleActions} from 'redux-actions'
import page from '../../vendor/modified-page'
import prepareFilesStructureForView from '../util/prepare-files-structure-for-view'
import findNode from '../util/find-node'

function identity (state, action) { return action.payload }

// ----------------
// course reducers
// ----------------

function indexObjectListByExportId (objectList, currentItems, type = null) {
  if (!objectList) return currentItems
  return objectList.reduce((hash, object) => {
    const key = (object.exportId ? object.exportId.toString() : object.id.toString())
    if (key) {
      const currentItem = Object.assign({}, currentItems[key])
      if (type && !currentItem.type) currentItem.type = type
      hash[key] = Object.assign(currentItem, object)
    }
    return hash
  }, {})
}

export function indexModuleItems (modules) {
  if (!modules) return {}
  return modules.reduce((hash, module) =>
    Object.assign(hash, indexObjectListByExportId(module.items, hash))
  , {})
}

export function indexCourseDataByExportId (state, action) {
  const objects = {}
  Object.assign(objects, indexModuleItems(action.payload.modules))
  Object.assign(objects, indexObjectListByExportId(action.payload.pages, objects, 'WikiPage'))
  Object.assign(objects, indexObjectListByExportId(action.payload.assignments, objects, 'Assignment'))
  Object.assign(objects, indexObjectListByExportId(action.payload.discussion_topics, objects, 'DiscussionTopic'))
  Object.assign(objects, indexObjectListByExportId(action.payload.quizzes, objects, 'Quizzes::Quiz'))
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
