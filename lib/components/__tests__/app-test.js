/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import {Link} from 'instructure-ui'
import App from '../app'
import PageHeader from '../page-header'
import ModulesView from '../modules-view'
import FilesList from '../files-list'

describe('App', () => {
  it('renders the page header', () => {
    const wrapper = shallow(
      <App course={{title: 'charmander'}} />
    )
    expect(wrapper.find(PageHeader)).toHaveLength(1)
  })

  it('renders the modules page by default', () => {
    const wrapper = shallow(
      <App course={{title: 'bulbasaur'}} />
    )
    expect(wrapper.find(ModulesView)).toHaveLength(1)
  })

  it('changes view based on the currentView', () => {
    const wrapper = mount(
      <App course={{title: 'squirtle', files: []}} />
    )
    wrapper.find(Link).simulate('click')
    expect(wrapper.find(FilesList)).toHaveLength(1)
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
    const wrapper = shallow(<App course={exampleCourse} redirector={mockRedirector} />)
    wrapper.instance().showFolder(exampleCourse.files[0])
    wrapper.instance().showFile(exampleCourse.files[0].files[0])
    expect(mockRedirector).toHaveBeenCalledTimes(1)
    expect(mockRedirector).toHaveBeenCalledWith('viewer/files/some_folder/some_file.txt')
  })
})
