/* eslint-env jest */

import React from 'react'
import {shallow, mount} from 'enzyme'
import ExternalLinkIndicator from '../external-link-indicator'

describe('ExternalLinkIndicator', () => {
  it('renders a popover', () => {
    const wrapper = shallow(<ExternalLinkIndicator />)
    expect(wrapper.find('Popover')).toHaveLength(1)
  })

  it('renders screen reader content', () => {
    const wrapper = shallow(<ExternalLinkIndicator />)
    const src = wrapper.find('ScreenReaderContent')
    expect(src).toHaveLength(1)
  })

  it('renders a tabbable icon', () => {
    const wrapper = mount(<ExternalLinkIndicator />)
    const icon = wrapper.find('IconExportLine')
    expect(icon).toHaveLength(1)
    expect(icon.props().tabIndex).toBe('0')
  })
})
