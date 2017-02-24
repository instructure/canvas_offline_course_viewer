/* eslint-env jest */

import React from 'react'
import {shallow} from 'enzyme'
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

  it('changes to files view', () => {
    const wrapper = shallow(
      <App course={{title: 'squirtle', files: [], modules: [{id: 1, items: []}]}} />
    )
    wrapper.instance().switchView('files')
    expect(wrapper.find('Connect(FilesView)')).toHaveLength(1) // smart component
  })

  it('navigates to a module item content page', () => {
    const wrapper = shallow(
      <App course={{title: 'pikachu', files: [], modules: [{id: 1, items: [{id: 1, title: 'voltix'}]}]}} />
    )
    wrapper.instance().switchView('content', 1)
    expect(wrapper.find('ContentPage')).toHaveLength(1)
    expect(wrapper.find('PageHeader').props()['breadcrumb']).toMatch(/voltix/)
  })
})
