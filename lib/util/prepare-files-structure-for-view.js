import _ from 'lodash'
import shortid from 'shortid'
import Deque from 'double-ended-queue'
import * as natcompare from './natcompare'

export default function prepareFilesStructureForView (files) {
  const top = {type: 'folder', name: 'root', size: null, path: [], files}
  const queue = new Deque([top])

  while (queue.length > 0) {
    const current = queue.shift()
    const onlyChildFolders = extractElementsOfType(current.files, 'folder')
    const onlyChildFiles = extractElementsOfType(current.files, 'file')

    // current is a clone, so it's ok (and necessary) to mutate
    current.key = shortid()
    current.expanded = false
    const children = onlyChildFolders.concat(onlyChildFiles)
    addPathsToChildren(current.path, children)
    current.files = children

    queue.push(...current.files)
  }

  top.expanded = true
  return top
}

function extractElementsOfType (files, type) {
  let result = []
  if (files) {
    result = files.filter(elt => elt.type === type)
    result = cloneAndSort(result)
  }
  return result
}

function cloneAndSort (files) {
  const result = files.map(file => _.clone(file))
  result.sort(natcompare.byKey('name'))
  return result
}

function addPathsToChildren (currentPath, children) {
  children.forEach((child, index) => {
    child.path = currentPath.concat(index)
  })
}
