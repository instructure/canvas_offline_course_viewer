/* eslint-env jest */

import React from 'react'
import {prepareFilesStructureForView} from '../../util/file-utils'
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

  it('makes directions visible when focused', () => {
    const wrapper = shallow(<FilesView reduxState={makeReduxState()} />)
    expect(wrapper.find('Transition').props().in).toBe(false)
    wrapper.instance().handleDirectionsFocus()
    expect(wrapper.find('Transition').props().in).toBe(true)
  })

  it('passes proper prefix path to files list', () => {
    const reduxState = makeReduxState()
    reduxState.currentFolderPath = [0]
    const wrapper = shallow(<FilesView reduxState={reduxState} />)
    expect(wrapper.find('FilesList').props().fileLinkPrefix).toEqual(['viewer', 'files', 'some_folder'])
  })
})
