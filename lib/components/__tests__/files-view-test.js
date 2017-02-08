/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import FilesView from '../files-view'

function makeExampleCourse () {
  return {
    files: [{
      type: 'folder',
      name: 'some_folder',
      size: null,
      files: [
        {type: 'file', name: 'some_file.txt', size: 4, files: null},
      ],
    }],
  }
}

describe('files-view', () => {
  it('renders a tree-view and a files-list', () => {
    const wrapper = shallow(<FilesView course={{}} />)
    expect(wrapper.find('TreeView').length).toBe(1)
    expect(wrapper.find('FilesList').length).toBe(1)
  })

  it('expands and collapses items', () => {
    const exampleCourse = makeExampleCourse()
    const wrapper = shallow(<FilesView course={exampleCourse} />)
    wrapper.instance().expandNode([0])
    expect(wrapper.instance().getFolder([0]).expanded).toBe(true)
  })

  it('handles tree item clicks', () => {
    const exampleCourse = makeExampleCourse()
    const wrapper = shallow(<FilesView course={exampleCourse} />)
    expect(wrapper.instance().getActiveFolderPath()).toEqual([])
    wrapper.instance().handleTreeItemClick([0])
    expect(wrapper.instance().getActiveFolderPath()).toEqual([0])
  })

  it('reveals folders when folder clicked in file list', () => {
    const exampleCourse = makeExampleCourse()
    const wrapper = shallow(<FilesView course={exampleCourse} />)
    expect(wrapper.instance().getFolder([]).expanded).toBe(false)
    wrapper.instance().showFolder(wrapper.instance().getFolder([0]))
    expect(wrapper.instance().getFolder([]).expanded).toBe(true)
  })

  it('redirects on file clicked', () => {
    const exampleCourse = makeExampleCourse()
    const mockRedirector = jest.fn()
    const wrapper = shallow(<FilesView course={exampleCourse} redirector={mockRedirector} />)

    // sad to reach into internal state, but it does the prepareFilesStructureForView transform
    // that adds necessary data to the course data
    const internalStructure = wrapper.instance().state.structure
    wrapper.instance().showFolder(internalStructure.files[0])
    wrapper.instance().showFile(internalStructure.files[0].files[0])
    expect(mockRedirector).toHaveBeenCalledTimes(1)
    expect(mockRedirector).toHaveBeenCalledWith('viewer/files/some_folder/some_file.txt')
  })

  it('redirects to escaped URLs on file clicked', () => {
    const exampleCourse = {
      files: [{
        type: 'folder',
        name: 'some#folder',
        size: null,
        files: [
          {type: 'file', name: '!@#$%^&*().txt', size: 4, files: null},
        ],
      }],
    }
    const mockRedirector = jest.fn()
    const wrapper = shallow(<FilesView course={exampleCourse} redirector={mockRedirector} />)

    // sad to reach into internal state, but it does the prepareFilesStructureForView transform
    // that adds necessary data to the course data
    const internalStructure = wrapper.instance().state.structure
    wrapper.instance().showFolder(internalStructure.files[0])
    wrapper.instance().showFile(internalStructure.files[0].files[0])
    expect(mockRedirector).toHaveBeenCalledTimes(1)
    expect(mockRedirector).toHaveBeenCalledWith('viewer/files/some%23folder/!%40%23%24%25%5E%26*().txt')
  })
})
