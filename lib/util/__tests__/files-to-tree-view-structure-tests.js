/* eslint-env jest */

import filesToTreeViewStructure from '../files-to-tree-view-structure'

describe('filesToTreeViewStructure', () => {
  it('does not modify the original', () => {
    const files = [{type: 'folder', name: 'test', size: null, files: []}]
    const result = filesToTreeViewStructure(files)
    expect(result.files).not.toBe(files)
    expect(result.files[0]).not.toBe(files[0])
    expect(files[0].key).toBeUndefined()
  })

  it('filters out files', () => {
    const files = [
      {type: 'folder', name: 'test', size: null, files: []},
      {type: 'file', name: 'file', size: 42, files: null},
    ]
    const result = filesToTreeViewStructure(files)
    expect(result.files.length).toBe(1)
  })

  it('brings over file properties to treeview properties', () => {
    const files = [{type: 'folder', name: 'test', size: null, files: []}]
    const result = filesToTreeViewStructure(files)
    const child = result.files[0]
    expect(child.key).toBeDefined() // random id so we can't test the value
    expect(child).toMatchObject({
      expanded: false,
      name: 'test',
      files: [],
    })
  })

  it('locale sorts by name', () => {
    const files = [
      { type: 'folder', name: 'é', size: null, files: [] },
      { type: 'folder', name: 'á', size: null, files: [] },
      { type: 'folder', name: 'e', size: null, files: [] },
      { type: 'folder', name: 'a', size: null, files: [] },
    ]
    const result = filesToTreeViewStructure(files)
    const labels = result.files.map(elt => elt.name)
    expect(labels).toEqual(['a', 'á', 'e', 'é'])
  })

  it('maintains deep folder tree structures', () => {
    const files = [{
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
    }]
    const result = filesToTreeViewStructure(files)
    expect(result).toMatchObject({
      files: [{
        name: 'test1',
        files: [{
          name: 'subtest1',
          files: [{
            name: 'subtest1_folder',
            files: [],
          }],
        }, {
          name: 'subtest2',
          files: [{
            name: 'subtest2_folder',
            files: [],
          }],
        }],
      }, {
        name: 'test2',
        files: [],
      }],
    })
  })
})
