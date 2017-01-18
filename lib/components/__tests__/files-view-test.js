/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import FilesView from '../files-view'

describe('files-view', () => {
  it('renders a tree-view and a files-list', () => {
    const wrapper = shallow(<FilesView course={{}} />)
    expect(wrapper.find('TreeView').length).toBe(1)
    expect(wrapper.find('FilesList').length).toBe(1)
  })

  it('redirects on file clicked', () => {
    const exampleCourse = {
      files: [{
        type: 'folder',
        name: 'some_folder',
        size: null,
        files: [
          {type: 'file', name: 'some_file.txt', size: 4, files: null},
        ],
      }],
    }
    const mockRedirector = jest.fn()
    const wrapper = shallow(<FilesView course={exampleCourse} redirector={mockRedirector} />)
    wrapper.instance().showFolder(exampleCourse.files[0])
    wrapper.instance().showFile(exampleCourse.files[0].files[0])
    expect(mockRedirector).toHaveBeenCalledTimes(1)
    expect(mockRedirector).toHaveBeenCalledWith('viewer/files/some_folder/some_file.txt')
  })
})
