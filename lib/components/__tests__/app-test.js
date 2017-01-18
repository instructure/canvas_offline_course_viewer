/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import App from '../app'
import PageHeader from '../page-header'
import ModulesView from '../modules-view'

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
    wrapper.find('Link').simulate('click')
    expect(wrapper.find('FilesView')).toHaveLength(1)
  })
})
