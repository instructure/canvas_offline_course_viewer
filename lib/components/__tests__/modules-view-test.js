/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import ModulesView from '../modules-view'

function makeData (numOfModules, numOfItemsPer) {
  const data = []
  for (let i = 0; i < numOfModules; i++) {
    const mod = {id: i, name: `Module${i}`, locked: false, items: [], prereqs: []}
    for (let j = 0; j < numOfItemsPer; j++) {
      const item = {
        id: j,
        type: 'Assignment',
        title: `Item${j}`,
      }
      mod.items.push(item)
    }
    data.push(mod)
  }
  return data
}

describe('modules', () => {
  it('renders a list of modules', () => {
    const numOfModules = 2
    const data = makeData(numOfModules, 0)
    const wrapper = enzyme.mount(<ModulesView modules={data} />)
    expect(wrapper.find('.modules__folder-icon-wrapper')).toHaveLength(1)
    expect(wrapper.find('.module-item__wrapper')).toHaveLength(numOfModules)
  })

  it('renders items for each module', () => {
    const numOfModules = 2
    const numOfItemsPer = 2
    const data = makeData(numOfModules, numOfItemsPer)
    const wrapper = enzyme.mount(<ModulesView modules={data} />)
    expect(wrapper.find('.module-item__row')).toHaveLength(numOfItemsPer * numOfModules)
  })

  it('renders prerequisites', () => {
    const modules = [
      {
        id: 1,
        name: 'Module 1',
        status: 'locked',
        unlockDate: '2017-03-01T13:04:00-0700',
        prereqs: [],
        items: [],
      },
      {
        id: 2,
        name: 'Module 2',
        status: 'locked',
        prereqs: [1],
        items: [],
      },
    ]
    const wrapper = enzyme.mount(<ModulesView modules={modules} />)
    expect(wrapper.find('.modules__prerequisites').text()).toMatch(/Prerequisites: /)
  })

  it('renders unlock dates', () => {
    const modules = [
      {
        id: 1,
        name: 'Module 1',
        status: 'locked',
        unlockDate: '2017-03-01T13:04:00-0700',
        prereqs: [],
        items: [],
      },
    ]
    const wrapper = enzyme.mount(<ModulesView modules={modules} />)
    expect(wrapper.find('.modules__lock-date').text()).toMatch(/Will unlock online/)
  })

  it('renders lock icon', () => {
    const modules = [
      {
        id: 1,
        name: 'Module 1',
        status: 'locked',
        unlockDate: '2017-03-01T13:04:00-0700',
        prereqs: [],
        items: [],
      },
    ]
    const wrapper = enzyme.mount(<ModulesView modules={modules} />)
    const lock = wrapper.find('.modules__status-icon')
    expect(lock.length).toEqual(1)
    expect(lock.text()).toMatch(/Locked until/)
  })
})
