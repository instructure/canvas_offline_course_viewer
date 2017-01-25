/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import ModuleItem from '../module-item'

describe('module items', () => {
  it('renders a list of module items', () => {
    const data = {
      type: 'assignment',
      title: 'Item1',
      completed: false,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__row')).toHaveLength(1)
    expect(wrapper.find('.module-item__points-possible')).toHaveLength(0)
  })

  it('renders different icons for different types', () => {
    const data = {
      type: 'assignment',
      title: 'Item1',
      completed: false,
    }
    const data2 = {
      type: 'quiz',
      title: 'Item2',
      completed: false,
    }
    const data3 = {
      type: 'discussion',
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

  it('renders points possible', () => {
    const data = {
      type: 'assignment',
      title: 'Item1',
      pointsPossible: 100,
    }
    const wrapper = enzyme.shallow(<ModuleItem item={data} />)
    expect(wrapper.find('.module-item__points-possible')).toHaveLength(1)
  })
})
