/* eslint-env jest */

import React from 'react'
import ContentArea from '../content-area'
import {mount} from 'enzyme'

describe('ContentArea', () => {
  it('adds an external link indicator to external links', () => {
    const wrapper = mount(<ContentArea content="<p><a href='http://example.com'>example</a></p>" />)
    // testing this is weird because we're inserting the link indicator manually
    // and enzyme doesn't notice. The text() and html() functions seem to work
    // as expected though.
    expect(wrapper.text()).toMatch(/external link/)
  })

  it('does not add an external link indicator to internal links', () => {
    const wrapper = mount(<ContentArea content="<p><a href='viewer/files/some_file.txt'>some file</a></p>" />)
    expect(wrapper.text()).not.toMatch(/external link/)
  })

  it('adds a target attribute to external links', () => {
    const wrapper = mount(<ContentArea content="<p><a href='https://example.com'>some file</a></p>" />)
    expect(wrapper.html()).toMatch('target="_blank"')
  })

  it('renders a no content message if there is not content', () => {
    const wrapper = mount(<ContentArea content={null} />)
    expect(wrapper.text()).toMatch(/No content/)
  })
})
