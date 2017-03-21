import _ from 'lodash'
import {combineReducers} from 'redux'
import {handleAction, handleActions} from 'redux-actions'
import page from '../../vendor/modified-page'
import {prepareFilesStructureForView} from '../util/file-utils'
import findNode from '../util/find-node'

function identity (state, action) { return action.payload }

// ----------------
// course reducers
// ----------------

function addAdditionalIndexes (catalog, content) {
  if (content.assignmentExportId) catalog[content.assignmentExportId] = content
  if (content.frontPage) catalog['frontPage'] = content
}

function mergeContentIntoCatalog (contentCatalog, contentObjectList, type = null) {
  if (!contentObjectList) return contentCatalog

  contentObjectList.forEach(currentContentObject => {
    const currentObjectKey = (currentContentObject.exportId ? currentContentObject.exportId.toString() : currentContentObject.id.toString())
    if (!currentObjectKey) return

    if (!contentCatalog[currentObjectKey]) contentCatalog[currentObjectKey] = {}
    const mergedContent = contentCatalog[currentObjectKey]
    Object.assign(mergedContent, currentContentObject)
    if (type && !mergedContent.type) mergedContent.type = type

    addAdditionalIndexes(contentCatalog, mergedContent)
  })
  return contentCatalog
}

export function catalogModuleItems (modules) {
  if (!modules) return {}
  return modules.reduce((moduleItemCatalog, module) =>
    mergeContentIntoCatalog(moduleItemCatalog, module.items)
  , {})
}

export function catalogCourseDataByExportId (state, action) {
  const course = action.payload
  const contentCatalog = catalogModuleItems(course.modules)
  mergeContentIntoCatalog(contentCatalog, course.pages, 'WikiPage')
  mergeContentIntoCatalog(contentCatalog, course.assignments, 'Assignment')
  mergeContentIntoCatalog(contentCatalog, course.discussion_topics, 'DiscussionTopic')
  mergeContentIntoCatalog(contentCatalog, course.quizzes, 'Quizzes::Quiz')
  return contentCatalog
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
  content: handleAction('INITIALIZE_COURSE', catalogCourseDataByExportId, {}),
})

export default reducer
