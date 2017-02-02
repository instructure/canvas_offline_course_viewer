import _ from 'lodash'
import shortid from 'shortid'
import Deque from 'double-ended-queue'
import * as natcompare from './natcompare'

export default function filesToTreeViewStructure (files) {
  const top = {type: 'folder', name: 'root', size: null, files}
  const queue = new Deque([top])

  while (queue.length > 0) {
    const current = queue.shift()
    let onlyChildFolders = []
    if (current.files) {
      onlyChildFolders = current.files.filter(elt => elt.type === 'folder')
    }
    onlyChildFolders = onlyChildFolders.map(folder => _.clone(folder))
    onlyChildFolders.sort(natcompare.byKey('name'))

    // current is a clone, so it's ok (and necessary) to mutate
    mutateFolderToTreeStructure(current, onlyChildFolders)
    queue.push(...current.files)
  }

  top.expanded = true
  return top
}

function mutateFolderToTreeStructure (folder, children) {
  folder.key = shortid()
  folder.expanded = false
  folder.files = children
}
