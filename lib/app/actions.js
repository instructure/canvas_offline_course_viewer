import {createAction} from 'redux-actions'
import page from '../../vendor/modified-page'

// intentionally do nothing
export const noop = () => ({type: 'NOOP'})

export const initializeCourse = createAction('INITIALIZE_COURSE') // imported course data

export const navigateToContent = (contentId) => {
  page.show(`/content/${contentId}`)
  return noop()
}

export const navigateToFolderPath = (folderPath) => {
  page.show('/files/' + folderPath.join('/'))
  return noop()
}

export const navigateToFolder = (folder) => {
  return navigateToFolderPath(folder.path)
}

export const expandFolder = createAction('EXPAND_FOLDER') // prepared folder
export const collapseFolder = createAction('COLLAPSE_FOLDER') // prepared folder
export const revealFolderPath = createAction('REVEAL_FOLDER_PATH') // array of numbers

// exportId may be omitted if it is not relevant to the view
export const switchView = createAction('SWITCH_VIEW', (viewName, exportId = null) => {
  return { viewName, exportId }
})
