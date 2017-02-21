/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import FlexLink from '../flex-link'

describe('FlexLink', () => {
  it('works around a firefox bug by wrapping contents in a display: flex div', () => {
    const wrapper = enzyme.shallow(<FlexLink>
      <span className='child' />
      <span className='child' />
    </FlexLink>)
    const link = wrapper.find('Link')
    expect(link.length).toBe(1)
    const flexDiv = link.find('.flex-link__wrapper')
    expect(flexDiv.props().style).toMatchObject({display: 'flex'})
    expect(flexDiv.find('.child').length).toBe(2)
  })

  it('passes properties to Link', () => {
    const wrapper = enzyme.shallow(<FlexLink href="foo" />)
    expect(wrapper.find('Link').props()).toMatchObject({href: 'foo'})
  })
})
