/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import App from '../app'
import PageHeader from '../page-header'

describe('App', () => {
  it('renders the page header', () => {
    const wrapper = shallow(
      <App course={{}} />
    )
    expect(wrapper.find(PageHeader)).toHaveLength(1)
  })
})
