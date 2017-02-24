import {createAction} from 'redux-actions'
import page from 'page'

// intentionally do nothing
export const noop = () => ({type: 'NOOP'})

export const initializeCourse = createAction('INITIALIZE_COURSE') // imported course data

export const navigateToModules = () => {
  page.show('/modules')
  return noop()
}

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
