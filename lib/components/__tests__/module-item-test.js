/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import ModuleItem from '../module-item'

describe('module items', () => {
  it('renders a list of module items', () => {
    const data = {
      type: 'Assignment',
      title: 'Item1',
      completed: false,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__row')).toHaveLength(1)
    expect(wrapper.find('.module-item__points-possible')).toHaveLength(0)
    expect(wrapper.find('IconCompleteSolid')).toHaveLength(0)
    expect(wrapper.find('ExternalLinkIndicator')).toHaveLength(0)
  })

  it('adds correct indent classes', () => {
    const data = {
      type: 'Assignment',
      title: 'Item1',
      indent: 0,
    }
    let wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__indent-1')).toHaveLength(0)
    data.indent = 1
    wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__indent-1')).toHaveLength(1)
    data.indent = 4
    wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__indent-4')).toHaveLength(1)
  })

  it('renders different icons for different types', () => {
    const data = {
      type: 'Assignment',
      title: 'Item1',
      completed: false,
    }
    const data2 = {
      type: 'Quizzes::Quiz',
      title: 'Item2',
      completed: false,
    }
    const data3 = {
      type: 'DiscussionTopic',
      title: 'Item3',
      completed: false,
    }
    const wrapperAssg = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapperAssg.find('IconAssignmentSolid')).toHaveLength(1)
    const wrapperQuiz = enzyme.shallow(<ModuleItem item={data2} />)
    expect(wrapperQuiz.find('IconQuizSolid')).toHaveLength(1)
    const wrapperDisc = enzyme.shallow(<ModuleItem item={data3} />)
    expect(wrapperDisc.find('IconDiscussionSolid')).toHaveLength(1)
  })

  it('displays checkmarks for completed items', () => {
    const data = {
      id: 1,
      type: 'Assignment',
      completed: true,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('IconCompleteSolid')).toHaveLength(1)
  })

  it('displays an external link indicator for external links', () => {
    const data = {
      id: 1,
      type: 'ExternalUrl',
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('ExternalLinkIndicator')).toHaveLength(1)
  })

  it('links directly to external sites', () => {
    const data = {
      id: 1,
      type: 'ExternalUrl',
      content: 'http://example.com',
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />).find('Link')
    expect(wrapper).toHaveLength(1)
    expect(wrapper.props().href).toMatch(/example.com/)
    expect(wrapper.props().target).toBe('_blank')
  })

  it('renders points possible', () => {
    const data = {
      type: 'Assignment',
      title: 'Item1',
      pointsPossible: 100,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__points-possible')).toHaveLength(1)
  })

  it('grays out locked items', () => {
    const data = {
      type: 'Assignment',
      title: 'Item1',
      locked: true,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__row__locked')).toHaveLength(1)
  })

  it('does not show a link for a subheader text item', () => {
    const data = {
      type: 'ContextModuleSubHeader',
      title: 'Text Header',
      locked: false,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__title').text()).not.toMatch('Link')
  })
})
