/* eslint-env jest */

import React from 'react'
import ParticipateOnline from '../participate-online'
import {shallow, mount} from 'enzyme'

describe('ParticipateOnline', () => {
  it('renders an assignment participation warning', () => {
    const wrapper = mount(<ParticipateOnline type="Assignment" />)
    expect(wrapper.text()).toMatch(/Assignments can only be submitted online./)
  })

  it('renders a quiz participation warning', () => {
    const wrapper = mount(<ParticipateOnline type="Quizzes::Quiz" />)
    expect(wrapper.text()).toMatch(/Quizzes can only be completed online./)
  })

  it('renders a quiz participation warning', () => {
    const wrapper = mount(<ParticipateOnline type="DiscussionTopic" />)
    expect(wrapper.text()).toMatch(/You can only participate in discussions online./)
  })

  it('renders an info icon', () => {
    const wrapper = shallow(<ParticipateOnline type="Assignment" />)
    expect(wrapper.find('IconInfoSolid')).toHaveLength(1)
  })
})
