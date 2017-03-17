/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import App from '../app'
import {indexModuleItems} from '../../app/reducer'

describe('App', () => {
  it('renders the page header', () => {
    const wrapper = shallow(
      <App course={{title: 'charmander'}} />
    )
    expect(wrapper.find('PageHeader')).toHaveLength(1)
  })

  it('renders the modules page by default', () => {
    const wrapper = shallow(
      <App course={{title: 'bulbasaur'}} />
    )
    expect(wrapper.find('ModulesView')).toHaveLength(1)
  })

  it('changes to files view', () => {
    const wrapper = shallow(
      <App course={{title: 'squirtle', files: [], modules: [{id: 1, items: []}]}}
      viewName="files" />
    )
    expect(wrapper.find('Connect(FilesView)')).toHaveLength(1) // smart component
  })

  it('navigates to a module item content page', () => {
    const course = {
      title: 'pikachu',
      files: [],
      modules: [
        {id: 1, items: [{id: 1, title: 'voltix'}]},
        {id: 2, items: [{id: 2, title: 'ghastly'}]},
      ],
    }
    const wrapper = shallow(
      <App course={course}
        viewName="content"
        exportId="2"
        content={indexModuleItems(course.modules)}
      />
    )
    expect(wrapper.find('ContentPage')).toHaveLength(1)
    expect(wrapper.find('PageHeader').props()['breadcrumb']).toMatch(/ghastly/)
  })

  it('navigates to a non-module item content page', () => {
    const course = {
      title: 'pikachu',
      files: [],
      modules: [],
      pages: [
        {exportId: 'a1b2c3', title: 'page title', content: 'page stuff'},
      ],
    }
    const wrapper = shallow(
      <App course={course}
        viewName="content"
        exportId="a1b2c3"
        content={{'a1b2c3': course.pages[0]}}
      />
    )
    expect(wrapper.find('ContentPage')).toHaveLength(1)
    expect(wrapper.find('PageHeader').props()['breadcrumb']).toMatch(/page title/)
  })

  it('creates the correct next button', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
          {id: 46},
        ],
      },
    ]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="45"
      content={indexModuleItems(modules)} />)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(2)
    expect(wrapper.find('.content__footer').find('[href="content/46"]')).toHaveLength(1)
  })

  it('creates a next button for an item in a different module', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46},
        ],
      },
    ]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="45"
      content={indexModuleItems(modules)}
    />)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(2)
    expect(wrapper.find('.content__footer').find('[href="content/46"]')).toHaveLength(1)
  })

  it('creates the correct previous button', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
          {id: 46},
        ],
      },
    ]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="46"
      content={indexModuleItems(modules)}/>)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(2)
    expect(wrapper.find('.content__footer').find('[href="content/45"]')).toHaveLength(1)
  })

  it('creates a previous button for an item in a different module', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46},
        ],
      },
    ]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="46"
      content={indexModuleItems(modules)}/>)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(2)
    expect(wrapper.find('.content__footer').find('[href="content/45"]')).toHaveLength(1)
  })

  it('creates both previous and next buttons', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46},
        ],
      },
      {
        id: 3,
        items: [
          {id: 47},
        ],
      },
    ]
    const wrapper = mount(<App
      course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="46"
      content={indexModuleItems(modules)}/>)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(3)
    expect(wrapper.find('.content__footer').find('[href="content/45"]')).toHaveLength(1)
    expect(wrapper.find('.content__footer').find('[href="content/47"]')).toHaveLength(1)
  })

  it('doesnt allow previous or next buttons for locked items', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
          {id: 52, locked: true},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46},
        ],
      },
      {
        id: 3,
        items: [
          {id: 53, locked: true},
          {id: 47},
        ],
      },
    ]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="46"
      content={indexModuleItems(modules)}/>)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(3)
    expect(wrapper.find('.content__footer').find('[href="content/45"]')).toHaveLength(1)
    expect(wrapper.find('.content__footer').find('[href="content/47"]')).toHaveLength(1)
  })

  it('skips ContextModuleSubHeader module items in navigation', () => {
    const modules = [
      {
        id: 1,
        items: [
          {id: 45},
          {id: 52, type: 'ContextModuleSubHeader'},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46},
        ],
      },
      {
        id: 3,
        items: [
          {id: 53, type: 'ContextModuleSubHeader'},
          {id: 47},
        ],
      },
    ]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules: modules}}
      viewName="content"
      exportId="46"
      content={indexModuleItems(modules)}/>)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(3)
    expect(wrapper.find('.content__footer').find('[href="content/45"]')).toHaveLength(1)
    expect(wrapper.find('.content__footer').find('[href="content/47"]')).toHaveLength(1)
  })
})
