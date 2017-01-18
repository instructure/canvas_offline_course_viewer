/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import PageHeader from '../page-header'
import {Breadcrumb, BreadcrumbLink} from 'instructure-ui'

function courseFixture () {
  return {
    title: 'some course',
    lastDownload: 'foobar',
  }
}

describe('PageHeader', () => {
  it('renders breadcrumbs', () => {
    const wrapper = shallow(
      <PageHeader course={courseFixture()} breadcrumb={'Modules'} />
    )
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
  })

  it('renders the date', () => {
    const wrapper = shallow(
      <PageHeader course={courseFixture()} breadcrumb={'Modules'} />
    )
    expect(wrapper.text()).toMatch(/foobar/)
  })

  it('renders the provided breadcrumb', () => {
    const wrapper = mount(
      <PageHeader course={courseFixture()} breadcrumb={'Modules'} />
    )
    const node = wrapper.find(BreadcrumbLink).at(1)
    expect(node.text()).toMatch(/Modules/)
  })
})
