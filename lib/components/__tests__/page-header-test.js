/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import PageHeader from '../page-header'
import {Breadcrumb, BreadcrumbLink} from 'instructure-ui'

function courseFixture (date = '2016-11-22T10:33:00Z') {
  return {
    title: 'some course',
    lastDownload: date,
  }
}

describe('PageHeader', () => {
  it('renders breadcrumbs', () => {
    const wrapper = shallow(
      <PageHeader course={courseFixture()} breadcrumb={'Modules'} />
    )
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
  })

  it('renders the date with momentjs', () => {
    const date = '2016-11-22T10:33:00Z'
    const wrapper = mount(
      <PageHeader course={courseFixture(date)} breadcrumb={'Modules'} />
    )
    expect(wrapper.text()).toMatch('Tue, Nov 22, 2016 10:33 AM')
  })

  it('renders the date correctly for different timezones', () => {
    let date = '2016-11-22T10:33:00-0900'
    let wrapper = mount(
      <PageHeader course={courseFixture(date)} breadcrumb={'Modules'} />
    )
    expect(wrapper.text()).toMatch('Tue, Nov 22, 2016 10:33 AM')

    date = '2016-11-22T10:33:00+0600'
    wrapper = mount(
      <PageHeader course={courseFixture(date)} breadcrumb={'Modules'} />
    )
    expect(wrapper.text()).toMatch('Tue, Nov 22, 2016 10:33 AM')
  })

  it('renders the provided breadcrumb', () => {
    const wrapper = mount(
      <PageHeader course={courseFixture()} breadcrumb={'Modules'} />
    )
    const node = wrapper.find(BreadcrumbLink).at(1)
    expect(node.text()).toMatch(/Modules/)
  })
})
