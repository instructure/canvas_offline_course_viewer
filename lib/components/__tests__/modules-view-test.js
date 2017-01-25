/* eslint-env jest */

import React from 'react'
import * as enzyme from 'enzyme'
import ModulesView from '../modules-view'

function makeData (numOfModules, numOfItemsPer) {
  const data = []
  for (let i = 0; i < numOfModules; i++) {
    const mod = {name: `Module${i}`, locked: false, items: []}
    for (let j = 0; j < numOfItemsPer; j++) {
      const item = {
        type: 'assignment',
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
})
