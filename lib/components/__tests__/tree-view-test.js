/* eslint-env jest */

import React from 'react'
import { mount } from 'enzyme'
import shortid from 'shortid'
import _ from 'lodash'
import TreeView from '../tree-view'

function pseudoKeyEvent (key) {
  return {
    key,
    preventDefault: () => {},
    stopPropagation: () => {},
  }
}

const FlatTree = Object.freeze({
  key: shortid(),
  label: 'root',
  expanded: true,
  children: [{
    key: shortid(),
    label: 'first',
    expanded: false,
    children: [],
  }, {
    key: shortid(),
    label: 'second',
    expanded: false,
    children: [],
  }],
})

const OneDeep = Object.freeze({
  key: shortid(),
  label: 'root',
  expanded: true,
  children: [{
    key: shortid(),
    label: 'first',
    expanded: true,
    children: [{
      key: shortid(),
      label: 'first first',
      expanded: false,
      children: [],
    }, {
      key: shortid(),
      label: 'first second',
      expanded: false,
      children: [],
    }],
  }, {
    key: shortid(),
    label: 'second',
    expanded: true,
    children: [{
      key: shortid(),
      label: 'second first',
      expanded: false,
      children: [],
    }, {
      key: shortid(),
      label: 'second second',
      expanded: false,
      children: [],
    }],
  }],
})

let tmp = _.cloneDeep(OneDeep)
tmp.children[0].expanded = false
const OneDeepFirstCollapsed = Object.freeze(tmp)

tmp = _.cloneDeep(OneDeep)
tmp.children[1].expanded = false
const OneDeepSecondCollapsed = Object.freeze(tmp)

tmp = _.cloneDeep(OneDeep)
tmp.children[0].children[0].expanded = true
tmp.children[0].children[0].children = [{
  key: shortid(),
  label: 'first first first',
  expanded: false,
  children: [],
}, {
  key: shortid(),
  label: 'first first second',
  expanded: false,
  children: [],
}]
tmp.children[0].children[1].expanded = true
tmp.children[0].children[1].children = [{
  key: shortid(),
  label: 'first second first',
  expanded: false,
  children: [],
}, {
  key: shortid(),
  label: 'first second second',
  expanded: false,
  children: [],
}]
tmp.children[1].children[0].expanded = true
tmp.children[1].children[0].children = [{
  key: shortid(),
  label: 'second first first',
  expanded: false,
  children: [],
}, {
  key: shortid(),
  label: 'second first second',
  expanded: false,
  children: [],
}]
tmp.children[1].children[1].expanded = true
tmp.children[1].children[1].children = [{
  key: shortid(),
  label: 'second second first',
  expanded: false,
  children: [],
}, {
  key: shortid(),
  label: 'second second second',
  expanded: false,
  children: [],
}]
const TwoDeep = Object.freeze(tmp)

describe('TreeView', () => {
  it('renders leaves as list items', () => {
    const wrapper = mount(<TreeView structure={FlatTree} />)
    expect(wrapper.find('ul li').length).toBe(2)
    expect(wrapper.find('ul li ul').length).toBe(0)
  })

  it('renders branches as list items with nested lists', () => {
    const wrapper = mount(<TreeView structure={OneDeep} />)
    expect(wrapper.find('ul li ul').length).toBe(2)
    expect(wrapper.find('ul li ul li').length).toBe(4)
  })

  it('does not render list items that are chldren of collapsed nodes', () => {
    const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} />)
    expect(wrapper.find('ul li ul li').length).toBe(2)
  })

  it('renders expand and collapse buttons', () => {
    const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} />)
    expect(wrapper.find('.treeview__button').length).toBe(2)
    expect(wrapper.find('IconArrowDownSolid').length).toBe(1)
    expect(wrapper.find('IconArrowRightSolid').length).toBe(1)
  })

  it('renders treeitem icons', () => {
    const wrapper = mount(<TreeView structure={OneDeep} />)
    expect(wrapper.find('IconFolderSolid').length).toBe(6)
  })

  it('reports item click', () => {
    const clickMock = jest.fn()
    const wrapper = mount(<TreeView structure={OneDeep} onItemClick={clickMock} />)
    const label = wrapper.find('.treeview__text').at(4)
    label.simulate('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(clickMock).toHaveBeenCalledWith([1, 0])
  })

  describe('treeview buttons', () => {
    it('collapses expanded items', () => {
      const mockCollapse = jest.fn()
      const wrapper = mount(<TreeView structure={OneDeep} onCollapseRequested={mockCollapse} />)
      wrapper.find('button').first().simulate('click')
      expect(mockCollapse).toHaveBeenCalledTimes(1)
      expect(mockCollapse).toHaveBeenCalledWith([0])
    })

    it('expands collapsed items', () => {
      const mockExpand = jest.fn()
      const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} onExpandRequested={mockExpand} />)
      wrapper.find('button').first().simulate('click')
      expect(mockExpand).toHaveBeenCalledTimes(1)
      expect(mockExpand).toHaveBeenCalledWith([0])
    })
  })

  describe('a11y and aria', () => {
    it('sets tabIndex=0 on one item', () => {
      const wrapper = mount(<TreeView structure={FlatTree} />)
      const instance = wrapper.instance()

      instance.handleNewFocusedPath([0])
      expect(wrapper.find('li[tabIndex="0"]').text()).toBe('first')

      instance.handleNewFocusedPath([1])
      expect(wrapper.find('li[tabIndex="0"]').text()).toBe('second')
    })

    it('uses one tree role', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('[role="tree"]').length).toBe(1)
    })

    it('uses group role on ul', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('ul[role="group"]').length).toBe(2)
    })

    it('uses treeitem role on li', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('li[role="treeitem"]').length).toBe(6)
    })

    it('sets aria-expanded to true when expanded', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('li[aria-expanded=true]').length).toBe(2)
    })

    it('sets aria-expanded to false when collapsed', () => {
      const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} />)
      expect(wrapper.find('li[aria-expanded=true]').length).toBe(1)
      expect(wrapper.find('li[aria-expanded=false]').length).toBe(1)
    })

    it('adds level to aria-label on items', () => {
      const wrapper = mount(<TreeView structure={FlatTree} />)
      const labels = wrapper.find('li').map((li) => li.prop('aria-label'))
      expect(labels.length).toBe(2)
      labels.forEach(label => expect(label).toMatch(/, level /))
    })
  })

  describe('down arrow', () => {
    it('focuses next sibling', () => {
      const wrapper = mount(<TreeView structure={FlatTree} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([1])
    })

    it('focuses next sibling of parent when last child', () => {
      const wrapper = mount(<TreeView structure={OneDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0, 1])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([1])
    })

    it('focuses first child if expanded', () => {
      const wrapper = mount(<TreeView structure={OneDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([0, 0])
    })

    it('focuses sibling if collapsed', () => {
      const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([1])
    })

    it('does nothing on last node of tree', () => {
      const wrapper = mount(<TreeView structure={OneDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([1, 1])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([1, 1])
    })

    it('does nothing on last collapsed node of tree', () => {
      const wrapper = mount(<TreeView structure={OneDeepSecondCollapsed} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([1])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([1])
    })

    it('focuses first child when tree has focus', () => {
      const wrapper = mount(<TreeView structure={OneDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.takeFocus()
      expect(instance.getFocusedPath()).toEqual([])
      instance.handleItemKey(pseudoKeyEvent('ArrowDown'))
      expect(instance.getFocusedPath()).toEqual([0])
    })
  })

  describe('up arrow', () => {
    it('focuses prior sibling on up arrow', () => {
      const wrapper = mount(<TreeView structure={FlatTree} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([1])
      instance.handleItemKey(pseudoKeyEvent('ArrowUp'))
      expect(instance.getFocusedPath()).toEqual([0])
    })

    it('focuses parent when first child', () => {
      const wrapper = mount(<TreeView structure={TwoDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([1, 0])
      instance.handleItemKey(pseudoKeyEvent('ArrowUp'))
      expect(instance.getFocusedPath()).toEqual([1])
    })

    it('focuses deepest last child of prior sibling', () => {
      const wrapper = mount(<TreeView structure={TwoDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([1])
      instance.handleItemKey(pseudoKeyEvent('ArrowUp'))
      expect(instance.getFocusedPath()).toEqual([0, 1, 1])
    })

    it('does not focus hidden children', () => {
      const structure = _.clone(TwoDeep)
      structure.children[0].children[1].expanded = false
      const wrapper = mount(<TreeView structure={structure} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([1])
      instance.handleItemKey(pseudoKeyEvent('ArrowUp'))
      expect(instance.getFocusedPath()).toEqual([0, 1])
    })

    it('focuses tree when first item', () => {
      const wrapper = mount(<TreeView structure={TwoDeep} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowUp'))
      expect(instance.getFocusedPath()).toEqual([])
    })

    it('does nothing when tree is focused', () => {
      const wrapper = mount(<TreeView structure={FlatTree} simulateFocus={true} />)
      const instance = wrapper.instance()
      instance.takeFocus()
      instance.handleItemKey(pseudoKeyEvent('ArrowUp'))
      expect(instance.getFocusedPath()).toEqual([])
    })
  })

  describe('right arrow', () => {
    it('expands branch on right arrow when collapsed', () => {
      const expandMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={OneDeepFirstCollapsed}
        simulateFocus={true}
        onExpandRequested={expandMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowRight'))
      expect(instance.getFocusedPath()).toEqual([0])
      expect(expandMock.mock.calls).toEqual([[[0]]])
    })

    it('focuses first child on right arrow when already expanded', () => {
      const expandMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={OneDeep}
        simulateFocus={true}
        onExpandRequested={expandMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowRight'))
      expect(instance.getFocusedPath()).toEqual([0, 0])
      expect(expandMock.mock.calls).toEqual([])
    })

    it('does nothing on right arrow when leaf', () => {
      const expandMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={OneDeep}
        simulateFocus={true}
        onExpandRequested={expandMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0, 0])
      instance.handleItemKey(pseudoKeyEvent('ArrowRight'))
      expect(instance.getFocusedPath()).toEqual([0, 0])
      expect(expandMock.mock.calls).toEqual([])
    })

    it('focuses first child when tree is focused', () => {
      const expandMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={FlatTree}
        simulateFocus={true}
        onExpandRequested={expandMock}
      />)
      const instance = wrapper.instance()
      instance.takeFocus()
      instance.handleItemKey(pseudoKeyEvent('ArrowRight'))
      expect(instance.getFocusedPath()).toEqual([0])
      expect(expandMock.mock.calls).toEqual([])
    })
  })

  describe('left arrow', () => {
    it('collapses node if expanded', () => {
      const collapseMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={OneDeep}
        simulateFocus={true}
        onCollapseRequested={collapseMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowLeft'))
      expect(instance.getFocusedPath()).toEqual([0])
      expect(collapseMock.mock.calls).toEqual([[[0]]])
    })

    it('focuses parent if leaf', () => {
      const collapseMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={OneDeep}
        simulateFocus={true}
        onCollapseRequested={collapseMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0, 1])
      instance.handleItemKey(pseudoKeyEvent('ArrowLeft'))
      expect(instance.getFocusedPath()).toEqual([0])
      expect(collapseMock.mock.calls).toEqual([])
    })

    it('focuses parent if collapsed', () => {
      const structure = _.cloneDeep(TwoDeep)
      structure.children[0].children[1].expanded = false
      const collapseMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={structure}
        simulateFocus={true}
        onCollapseRequested={collapseMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0, 1])
      instance.handleItemKey(pseudoKeyEvent('ArrowLeft'))
      expect(instance.getFocusedPath()).toEqual([0])
      expect(collapseMock.mock.calls).toEqual([])
    })

    it('focuses tree when focused at first child of top level', () => {
      const collapseMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={FlatTree}
        simulateFocus={true}
        onCollapseRequested={collapseMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([0])
      instance.handleItemKey(pseudoKeyEvent('ArrowLeft'))
      expect(instance.getFocusedPath()).toEqual([])
      expect(collapseMock.mock.calls).toEqual([])
    })
  })
})
