/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import PageHeader from '../page-header'
import {Breadcrumb} from 'instructure-ui'

function courseFixture () {
  return {
    title: 'some course',
    lastDownload: 'foobar',
  }
}

describe('PageHeader', () => {
  it('renders breadcrumbs', () => {
    const wrapper = shallow(
      <PageHeader course={courseFixture()} />
    )
    expect(wrapper.find(Breadcrumb)).toHaveLength(1)
  })

  it('renders the date', () => {
    const wrapper = shallow(
      <PageHeader course={courseFixture()} />
    )
    expect(wrapper.text()).toMatch(/foobar/)
  })
})
