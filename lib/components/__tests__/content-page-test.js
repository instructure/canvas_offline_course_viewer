/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import ContentPage from '../content-page'

describe('content page', () => {
  it('renders the content page', () => {
    const data = {
      type: 'WikiPage',
      content: 'Team Rocket blastoff at the speed of light',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} />)
    expect(wrapper.find('.content__body')).toHaveLength(1)
    expect(wrapper.find('.content__footer')).toHaveLength(1)
    expect(wrapper.find('.content__content')).toHaveLength(1)
  })

  it('renders an assignment content with assignments', () => {
    const data = {
      type: 'Assignment',
      content: 'Team Rocket blastoff at the speed of light',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} />)
    expect(wrapper.find('AssignmentContent')).toHaveLength(1)
  })

  it('renders an assignment content with quizzes', () => {
    const data = {
      type: 'Quizzes::Quiz',
      content: 'Team Rocket blastoff at the speed of light',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} />)
    expect(wrapper.find('AssignmentContent')).toHaveLength(1)
  })

  it('renders an assignment content with discussions', () => {
    const data = {
      type: 'DiscussionTopic',
      content: 'Team Rocket blastoff at the speed of light',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} />)
    expect(wrapper.find('AssignmentContent')).toHaveLength(1)
  })
})
