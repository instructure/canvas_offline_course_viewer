/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import AssignmentContent from '../assignment-content'

describe('assignment content', () => {
  it('renders an assignment content', () => {
    const data = {
      type: 'Assignment',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
    }
    const wrapper = enzyme.shallow(<AssignmentContent item={data} />)
    expect(wrapper.find('.content__title')).toHaveLength(1)
    expect(wrapper.find('.content__details')).toHaveLength(1)
    expect(wrapper.find('.content__content')).toHaveLength(1)
  })

  it('renders details for assignments', () => {
    const date = '2016-11-22T10:33:00Z'
    const data = {
      type: 'Assignment',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      dueAt: date,
      pointsPossible: 10,
      submissionTypes: 'a feather in your cap',
      lockAt: date,
      unlockAt: date,
    }
    const wrapper = enzyme.mount(<AssignmentContent item={data} />)
    expect(wrapper.text()).toMatch(/Due/)
    expect(wrapper.text()).toMatch(/Points/)
    expect(wrapper.text()).toMatch(/Submitting/)
    expect(wrapper.text()).toMatch(/Available/)
    expect(wrapper.text()).toMatch('Tue, Nov 22, 2016 10:33 AM')
  })

  it('renders details for quizzes', () => {
    const data = {
      type: 'Quizzes::Quiz',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      questionCount: 5,
      timeLimit: 5,
      attempts: 5,
    }
    const wrapper = enzyme.mount(<AssignmentContent item={data} />)
    expect(wrapper.text()).toMatch(/Questions/)
    expect(wrapper.text()).toMatch(/Time Limit/)
    expect(wrapper.text()).toMatch(/Allowed Attempts/)
  })

  it('renders details for discussions', () => {
    const data = {
      type: 'DiscussionTopic',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      graded: true,
    }
    const wrapper = enzyme.mount(<AssignmentContent item={data} />)
    expect(wrapper.text()).toMatch(/This is a graded discussion/)
  })

  it('doesnt render null values', () => {
    const data = {
      type: 'Assignment',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      dueAt: null,
      pointsPossible: null,
      submissionTypes: null,
      lockAt: null,
      unlockAt: null,
    }
    const wrapper = enzyme.mount(<AssignmentContent item={data} />)
    expect(wrapper.text()).not.toMatch(/Due/)
    expect(wrapper.text()).not.toMatch(/Points/)
    expect(wrapper.text()).not.toMatch(/Submitting/)
    expect(wrapper.text()).not.toMatch(/Available/)
    expect(wrapper.text()).not.toMatch('Tue, Nov 22, 2016 10:33 AM')
  })
})
