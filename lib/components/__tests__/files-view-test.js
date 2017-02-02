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
    // for now I'm just happy that it can be called so that code gets covered
    // I don't really want to inspect internal state for the effects
    expect(() => wrapper.instance().setNodeExpanded([0])).not.toThrow()
  })

  it('handles tree item clicks') // stubbed for when we do something besides logging

  it('redirects on file clicked', () => {
    const exampleCourse = makeExampleCourse()
    const mockRedirector = jest.fn()
    const wrapper = shallow(<FilesView course={exampleCourse} redirector={mockRedirector} />)
    wrapper.instance().showFolder(exampleCourse.files[0])
    wrapper.instance().showFile(exampleCourse.files[0].files[0])
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
    wrapper.instance().showFolder(exampleCourse.files[0])
    wrapper.instance().showFile(exampleCourse.files[0].files[0])
    expect(mockRedirector).toHaveBeenCalledTimes(1)
    expect(mockRedirector).toHaveBeenCalledWith('viewer/files/some%23folder/!%40%23%24%25%5E%26*().txt')
  })
})
