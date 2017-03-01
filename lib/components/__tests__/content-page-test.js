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

  it('renders html content', () => {
    const data = {
      type: 'WikiPage',
      content: '<p><img alt="blasting off" /></p>',
    }
    const wrapper = enzyme.mount(<ContentPage item={data} />)
    expect(wrapper.html()).toMatch(/blasting off/)
    expect(wrapper.text()).not.toMatch(/blasting off/)
  })

  it('renders prev and next buttons', () => {
    const data = {
      type: 'WikiPage',
      content: '<p><img alt="blasting off" /></p>',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} nextId={3} prevId={1} />)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(3)
    expect(wrapper.find('.content__footer').find('[href="content/1"]')).toHaveLength(1)
    expect(wrapper.find('.content__footer').find('[href="content/3"]')).toHaveLength(1)
  })

  it('doesnt render a prev button if the prop is null', () => {
    const data = {
      type: 'WikiPage',
      content: '<p><img alt="blasting off" /></p>',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} nextId={2} prevId={null} />)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(2)
  })

  it('doesnt render a next button if the prop is null', () => {
    const data = {
      type: 'WikiPage',
      content: '<p><img alt="blasting off" /></p>',
    }
    const wrapper = enzyme.shallow(<ContentPage item={data} nextId={null} prevId={1} />)
    expect(wrapper.find('.content__footer').find('Button')).toHaveLength(2)
  })
})
