import shortid from 'shortid'
import _ from 'lodash'

export const Empty = Object.freeze({
  key: shortid(),
  type: 'folder',
  name: 'root',
  path: [],
  expanded: true,
  files: [],
})

export const FlatTree = Object.freeze({
  key: shortid(),
  type: 'folder',
  name: 'root',
  path: [],
  expanded: true,
  files: [{
    key: shortid(),
    type: 'folder',
    name: 'first',
    path: [0],
    expanded: false,
    files: [],
  }, {
    key: shortid(),
    type: 'folder',
    name: 'second',
    path: [1],
    expanded: false,
    files: [],
  }, {
    key: shortid(),
    type: 'file',
    name: 'file-to-be-ignored.frog',
    path: [2],
    expanded: false,
    files: [],
  }],
})

export const OneDeep = Object.freeze({
  key: shortid(),
  type: 'folder',
  name: 'root',
  path: [],
  expanded: true,
  files: [{
    key: shortid(),
    type: 'folder',
    name: 'first',
    path: [0],
    expanded: true,
    files: [{
      key: shortid(),
      type: 'folder',
      name: 'first first',
      path: [0, 0],
      expanded: false,
      files: [],
    }, {
      key: shortid(),
      type: 'folder',
      name: 'first second',
      path: [0, 1],
      expanded: false,
      files: [],
    }],
  }, {
    key: shortid(),
    type: 'folder',
    name: 'second',
    path: [1],
    expanded: true,
    files: [{
      key: shortid(),
      type: 'folder',
      name: 'second first',
      path: [1, 0],
      expanded: false,
      files: [],
    }, {
      key: shortid(),
      type: 'folder',
      name: 'second second',
      path: [1, 1],
      expanded: false,
      files: [],
    }],
  }],
})

let tmp = _.cloneDeep(OneDeep)
tmp.files[0].expanded = false
export const OneDeepFirstCollapsed = Object.freeze(tmp)

tmp = _.cloneDeep(OneDeep)
tmp.files[1].expanded = false
export const OneDeepSecondCollapsed = Object.freeze(tmp)

tmp = _.cloneDeep(OneDeep)
tmp.files[0].files[0].expanded = true
tmp.files[0].files[0].files = [{
  key: shortid(),
  type: 'folder',
  name: 'first first first',
  path: [0, 0, 0],
  expanded: false,
  files: [],
}, {
  key: shortid(),
  type: 'folder',
  name: 'first first second',
  path: [0, 0, 1],
  expanded: false,
  files: [],
}]
tmp.files[0].files[1].expanded = true
tmp.files[0].files[1].files = [{
  key: shortid(),
  type: 'folder',
  name: 'first second first',
  path: [0, 1, 0],
  expanded: false,
  files: [],
}, {
  key: shortid(),
  type: 'folder',
  name: 'first second second',
  path: [0, 1, 1],
  expanded: false,
  files: [],
}]
tmp.files[1].files[0].expanded = true
tmp.files[1].files[0].files = [{
  key: shortid(),
  type: 'folder',
  name: 'second first first',
  path: [1, 0, 0],
  expanded: false,
  files: [],
}, {
  key: shortid(),
  type: 'folder',
  name: 'second first second',
  path: [1, 0, 1],
  expanded: false,
  files: [],
}]
tmp.files[1].files[1].expanded = true
tmp.files[1].files[1].files = [{
  key: shortid(),
  type: 'folder',
  name: 'second second first',
  path: [1, 1, 0],
  expanded: false,
  files: [],
}, {
  key: shortid(),
  type: 'folder',
  name: 'second second second',
  path: [1, 1, 1],
  expanded: false,
  files: [],
}]
export const TwoDeep = Object.freeze(tmp)
