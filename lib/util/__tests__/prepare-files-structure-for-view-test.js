/* eslint-env jest */

import {prepareFilesStructureForView} from '../file-utils'

describe('prepareFilesStructureForView', () => {
  it('assigns the course title to the root folder', () => {
    const course = {title: 'some course', files: []}
    const result = prepareFilesStructureForView(course)
    expect(result.name).toBe('some course')
  })

  it('does not modify the original', () => {
    const course = {files: [{type: 'folder', name: 'test', size: null, files: []}]}
    const result = prepareFilesStructureForView(course)
    expect(result.files).not.toBe(course.files)
    expect(result.files[0]).not.toBe(course.files[0])
    expect(course.files[0].key).toBeUndefined()
  })

  it('brings over file properties to treeview properties', () => {
    const course = {files: [{type: 'folder', name: 'test', size: null, files: []}]}
    const result = prepareFilesStructureForView(course)
    const child = result.files[0]
    expect(child.key).toBeDefined() // random id so we can't test the value
    expect(child).toMatchObject({
      expanded: false,
      name: 'test',
      files: [],
    })
  })

  it('locale sorts by name', () => {
    const course = { files: [
      { type: 'folder', name: 'é', size: null, files: [] },
      { type: 'folder', name: 'á', size: null, files: [] },
      { type: 'folder', name: 'e', size: null, files: [] },
      { type: 'folder', name: 'a', size: null, files: [] },
    ]}
    const result = prepareFilesStructureForView(course)
    const labels = result.files.map(elt => elt.name)
    expect(labels).toEqual(['a', 'á', 'e', 'é'])
  })

  it('sorts folders before files', () => {
    const course = { files: [
      { type: 'file', name: 'aaa_file', size: 42, files: null },
      { type: 'folder', name: 'zzz_folder', size: null, files: [] },
    ]}
    const result = prepareFilesStructureForView(course)
    expect(result.files.map(elt => elt.name)).toEqual(['zzz_folder', 'aaa_file'])
  })

  it('maintains deep folder tree structures and paths', () => {
    const course = {files: [{
      type: 'folder',
      name: 'test1',
      size: null,
      files: [{
        type: 'folder',
        name: 'subtest1',
        size: null,
        files: [
          {type: 'file', name: 'subtest1_file', size: 42, files: null},
          {type: 'folder', name: 'subtest1_folder', size: null, files: []},
        ],
      }, {
        type: 'folder',
        name: 'subtest2',
        size: null,
        files: [
          {type: 'folder', name: 'subtest2_folder', size: null, files: []},
        ],
      }],
    }, {
      type: 'folder',
      name: 'test2',
      size: null,
      files: [],
    }]}
    const result = prepareFilesStructureForView(course)
    expect(result).toMatchObject({
      files: [{
        name: 'test1',
        path: [0],
        files: [{
          name: 'subtest1',
          path: [0, 0],
          files: [{
            name: 'subtest1_folder',
            path: [0, 0, 0],
            files: [],
          }, {
            name: 'subtest1_file',
            path: [0, 0, 1],
          }],
        }, {
          name: 'subtest2',
          path: [0, 1],
          files: [{
            name: 'subtest2_folder',
            path: [0, 1, 0],
            files: [],
          }],
        }],
      }, {
        name: 'test2',
        path: [1],
        files: [],
      }],
    })
  })
})
