/* eslint-env jest */

import React from 'react'
import OnlineOnlyContent from '../online-only-content'
import {mount} from 'enzyme'

describe('ContentArea', () => {
  it('renders the text', () => {
    const wrapper = mount(<OnlineOnlyContent />)
    expect(wrapper.text()).toMatch(/This content is only available online/)
  })
})
