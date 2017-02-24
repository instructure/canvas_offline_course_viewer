/* eslint-env jest */

import React from 'react'
import prepareFilesStructureForView from '../../util/prepare-files-structure-for-view'
import { shallow } from 'enzyme'
import {FilesView} from '../files-view'

function makeExampleCourse () {
  return {
    title: 'some course',
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

function makeReduxState (course) {
  if (!course) course = makeExampleCourse()
  return {
    structure: prepareFilesStructureForView(course),
    currentFolderPath: [],
  }
}

describe('files-view', () => {
  it('passes callbacks through to underlying components', () => {
    const callbacks = {
      expandFolder: jest.fn(),
      collapseFolder: jest.fn(),
      navigateToFolder: jest.fn(),
    }
    const wrapper = shallow(<FilesView reduxState={makeReduxState()} {...callbacks} />)
    const treeViewProps = wrapper.find('TreeView').props()
    expect(treeViewProps.onExpandRequested).toBe(callbacks.expandFolder)
    expect(treeViewProps.onCollapseRequested).toBe(callbacks.collapseFolder)
    expect(treeViewProps.onItemClick).toBe(callbacks.navigateToFolder)
    const filesListProps = wrapper.find('FilesList').props()
    expect(filesListProps.onFolderClick).toBe(callbacks.navigateToFolder)
  })

  it('redirects to escaped URLs on file clicked', () => {
    const exampleCourse = {
      title: 'some course',
      files: [{
        type: 'folder',
        name: 'some#folder',
        size: null,
        files: [
          {type: 'file', name: '!@#$%^&*().txt', size: 4, files: null},
        ],
      }],
    }
    const reduxState = makeReduxState(exampleCourse)
    reduxState.currentFolderPath = [0]
    const mockRedirector = jest.fn()
    const wrapper = shallow(<FilesView reduxState={reduxState}
      redirector={mockRedirector} />)
    wrapper.instance().showFile(reduxState.structure.files[0].files[0])
    expect(mockRedirector).toHaveBeenCalledTimes(1)
    expect(mockRedirector).toHaveBeenCalledWith('viewer/files/some%23folder/!%40%23%24%25%5E%26*().txt')
  })
})
