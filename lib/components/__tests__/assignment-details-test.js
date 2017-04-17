/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import AssignmentDetails from '../assignment-details'

describe('assignment details', () => {
  it('renders an assignment content', () => {
    const data = {
      type: 'Assignment',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
    }
    const wrapper = enzyme.shallow(<AssignmentDetails item={data} />)
    expect(wrapper.find('.content__details')).toHaveLength(1)
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
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
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
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).toMatch(/Questions/)
    expect(wrapper.text()).toMatch(/Time Limit/)
    expect(wrapper.text()).toMatch(/Allowed Attempts/)
  })

  it('renders details for graded discussions', () => {
    const data = {
      type: 'DiscussionTopic',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      graded: true,
    }
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).toMatch(/This is a graded discussion/)
  })

  it('renders only availability dates for ungraded discussions', () => {
    const data = {
      type: 'DiscussionTopic',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      graded: false,
      lockAt: '2017-01-02',
      unlockAt: '2017-01-01',
    }
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).not.toMatch(/This is a graded discussion/)
    expect(wrapper.text()).not.toMatch(/Due/)
    expect(wrapper.text()).not.toMatch(/Points/)
    expect(wrapper.text()).toMatch(/Available.*after/)
    expect(wrapper.text()).toMatch(/Available.*until/)
  })

  it('renders nothing if discussion has no availability dates', () => {
    const data = {
      type: 'DiscussionTopic',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      graded: false,
    }
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.find('.content__details')).toHaveLength(0)
  })

  it('renders due, time limit and points possible if they are undefined', () => {
    const data = {
      type: 'Quizzes::Quiz',
      title: 'To protect the world from devastation',
      content: 'Team Rocket blastoff at the speed of light',
      dueAt: undefined,
      pointsPossible: undefined,
      timeLimit: undefined,
      submissionTypes: undefined,
      lockAt: undefined,
      unlockAt: undefined,
    }
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).toMatch(/Due.*?No Due Date/)
    expect(wrapper.text()).toMatch(/Points.*?None/)
    expect(wrapper.text()).toMatch(/Time Limit.*?None/)
  })

  it('doesnt render null values other than due, time limit and points possible', () => {
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
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).not.toMatch(/Submitting/)
    expect(wrapper.text()).not.toMatch(/Available.*?until/)
    expect(wrapper.text()).not.toMatch('Tue, Nov 22, 2016 10:33 AM')
    expect(wrapper.text()).not.toMatch(/Available.*?after/)
  })

  it('returns unlimited attempts for quizzes with -1 attempts', () => {
    const data = {
      type: 'Quizzes::Quiz',
      title: 'To protect the world from devastation',
      attempts: -1,
    }
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).toMatch(/unlimited/)
  })

  it('quiz time limit values have units in minutes', () => {
    const data = {
      type: 'Quizzes::Quiz',
      title: 'To protect the world from devastation',
      timeLimit: 5,
    }
    const wrapper = enzyme.mount(<AssignmentDetails item={data} />)
    expect(wrapper.text()).toMatch(/minutes/)
  })
})
