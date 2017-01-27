/* eslint-env jest */

import filesToTreeViewStructure from '../files-to-tree-view-structure'

describe('filesToTreeViewStructure', () => {
  it('does not modify the original', () => {
    const files = [{type: 'folder', name: 'test', size: null, files: []}]
    const result = filesToTreeViewStructure(files)
    expect(result.children).not.toBe(files)
    expect(result.children[0]).not.toBe(files[0])
    expect(files[0].key).toBeUndefined()
  })

  it('filters out files', () => {
    const files = [
      {type: 'folder', name: 'test', size: null, files: []},
      {type: 'file', name: 'file', size: 42, files: null},
    ]
    const result = filesToTreeViewStructure(files)
    expect(result.children.length).toBe(1)
  })

  it('converts file properties to treeview properties', () => {
    const files = [{type: 'folder', name: 'test', size: null, files: []}]
    const result = filesToTreeViewStructure(files)
    const child = result.children[0]
    expect(child.key).toBeDefined() // random id so we can't test the value
    expect(child).toMatchObject({
      expanded: false,
      label: 'test',
      children: [],
    })
  })

  it('removes folder properties', () => {
    const files = [{type: 'folder', name: 'test', size: null, files: []}]
    const result = filesToTreeViewStructure(files)
    const child = result.children[0]
    expect(child.type).toBeUndefined()
    expect(child.name).toBeUndefined()
    expect(child.size).toBeUndefined()
    expect(child.files).toBeUndefined()
  })

  it('locale sorts by name', () => {
    const files = [
      { type: 'folder', name: 'é', size: null, files: [] },
      { type: 'folder', name: 'á', size: null, files: [] },
      { type: 'folder', name: 'e', size: null, files: [] },
      { type: 'folder', name: 'a', size: null, files: [] },
    ]
    const result = filesToTreeViewStructure(files)
    const labels = result.children.map(elt => elt.label)
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
      children: [{
        label: 'test1',
        children: [{
          label: 'subtest1',
          children: [{
            label: 'subtest1_folder',
            children: [],
          }],
        }, {
          label: 'subtest2',
          children: [{
            label: 'subtest2_folder',
            children: [],
          }],
        }],
      }, {
        label: 'test2',
        children: [],
      }],
    })
  })
})
