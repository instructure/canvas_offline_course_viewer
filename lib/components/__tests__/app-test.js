/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import App from '../app'
import {indexModuleItems, indexCourseDataByExportId} from '../../app/reducer'

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
          {id: 45, content: 'first'},
          {id: 46, content: 'second'},
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
          {id: 45, content: 'first'},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46, content: 'second'},
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
          {id: 45, content: 'first'},
          {id: 46, content: 'second'},
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
          {id: 45, content: 'first'},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46, content: 'second'},
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
          {id: 45, content: 'first'},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46, content: 'second'},
        ],
      },
      {
        id: 3,
        items: [
          {id: 47, content: 'third'},
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
          {id: 45, content: 'first'},
          {id: 52, locked: true, content: 'second'},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46, content: 'third'},
        ],
      },
      {
        id: 3,
        items: [
          {id: 53, locked: true, content: 'fourth'},
          {id: 47, content: 'fifth'},
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
          {id: 45, content: 'first'},
          {id: 52, type: 'ContextModuleSubHeader', content: 'second'},
        ],
      },
      {
        id: 2,
        items: [
          {id: 46, content: 'third'},
        ],
      },
      {
        id: 3,
        items: [
          {id: 53, type: 'ContextModuleSubHeader', content: 'fourth'},
          {id: 47, content: 'fifth'},
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

  it('does not render previous and next buttons for unavailable content', () => {
    const modules = [{
      id: 1,
      items: [
        {id: 45, content: 'first'},
        {id: 46, content: '', locked: true},
        {id: 47, content: 'last'},
      ],
    }]
    const wrapper = mount(<App course={{title: 'pichu', files: [], modules}}
      viewName="content"
      exportId="46"
      content={indexModuleItems(modules)} />)
    expect(wrapper.find('.content__footer Button')).toHaveLength(1)
  })

  it('shows assignment headers for assignments', () => {
    const course = {
      title: 'pikachu',
      files: [],
      modules: [],
      assignments: [
        {exportId: 'a1b2c3', title: 'page title', content: 'page stuff', dueAt: '2017-03-22T13:00:00-0600'},
      ],
    }
    const wrapper = mount(
      <App course={course}
        viewName="content"
        exportId="a1b2c3"
        content={indexCourseDataByExportId({}, {payload: course})}
      />
    )
    expect(wrapper.find('AssignmentContent')).toHaveLength(1)
  })
})
