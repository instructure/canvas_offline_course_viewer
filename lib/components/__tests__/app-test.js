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
      <App course={{title: 'squirtle', files: [], modules: [{id: 1, items: []}]}} />
    )
    wrapper.find('Link').at(1).simulate('click') // first Link is the breadcrumb
    expect(wrapper.find('FilesView')).toHaveLength(1)
  })

  it('navigates to a module item content page', () => {
    const wrapper = mount(
      <App course={{title: 'pikachu', files: [], modules: [{id: 1, items: [{id: 1, title: 'voltix'}]}]}} />
    )
    wrapper.find('.module-item__title').at(0).find('Link').simulate('click')
    expect(wrapper.find('ContentPage')).toHaveLength(1)
    expect(wrapper.find('PageHeader').text()).toMatch(/voltix/)
  })
})
