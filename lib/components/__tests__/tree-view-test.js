/* eslint-env jest */

import React from 'react'
import { shallow, mount } from 'enzyme'
import _ from 'lodash'
import TreeView from '../tree-view'
import {Empty, FlatTree, OneDeep, OneDeepFirstCollapsed, OneDeepSecondCollapsed, TwoDeep}
  from '../../fixtures/file-structure-fixtures'

function pseudoKeyEvent (key) {
  return {
    key,
    preventDefault: () => {},
    stopPropagation: () => {},
  }
}

function mockCallPath (mock) {
  return mock.mock.calls[0][0].path
}

describe('TreeView', () => {
  it('renders the root', () => {
    const wrapper = shallow(<TreeView structure={Empty} />)
    expect(wrapper.find('TreeItem').length).toBe(1)
  })

  it('ignores files', () => {
    const wrapper = shallow(<TreeView structure={FlatTree} />)
    expect(wrapper.find('TreeItem').length).toBe(3)
  })

  it('renders leaves as list items', () => {
    const wrapper = mount(<TreeView structure={FlatTree} />)
    expect(wrapper.find('ul li').length).toBe(3)
    expect(wrapper.find('ul li ul').length).toBe(1)
  })

  it('renders branches as list items with nested lists', () => {
    const wrapper = mount(<TreeView structure={OneDeep} />)
    expect(wrapper.find('ul li ul').length).toBe(3)
    // 6 because this selector will skip the root item
    expect(wrapper.find('ul li ul li').length).toBe(6)
  })

  it('does not render list items that are chldren of collapsed nodes', () => {
    const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} />)
    expect(wrapper.find('ul li ul li').length).toBe(4)
  })

  it('renders expand and collapse buttons', () => {
    const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} />)
    expect(wrapper.find('.treeview__button').length).toBe(3)
    expect(wrapper.find('IconArrowDownSolid').length).toBe(2)
    expect(wrapper.find('IconArrowRightSolid').length).toBe(1)
  })

  it('renders treeitem icons', () => {
    const wrapper = mount(<TreeView structure={OneDeep} />)
    expect(wrapper.find('IconFolderSolid').length).toBe(7)
  })

  it('reports item click', () => {
    const clickMock = jest.fn()
    const wrapper = mount(<TreeView structure={OneDeep} onItemClick={clickMock} />)
    const label = wrapper.find('.treeview__text').at(5)
    label.simulate('click')
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(mockCallPath(clickMock)).toEqual([1, 0])
  })

  it('labels list items', () => {
    const wrapper = mount(<TreeView structure={FlatTree} />)
    const labels = wrapper.find('.treeview__text').map(elt => elt.text())
    expect(labels).toEqual(['root', 'first', 'second'])
  })

  it('highlights selected folder', () => {
    const wrapper = mount(<TreeView structure={FlatTree} selectedPath={[0]} />)
    expect(wrapper.find('.treeview__row__selected').length).toBe(1)
  })

  describe('treeview buttons', () => {
    it('collapses expanded items', () => {
      const mockCollapse = jest.fn()
      const wrapper = mount(<TreeView structure={OneDeep} onCollapseRequested={mockCollapse} />)
      wrapper.find('.treeview__button button').at(1).simulate('click')
      expect(mockCollapse).toHaveBeenCalledTimes(1)
      expect(mockCallPath(mockCollapse)).toEqual([0])
    })

    it('expands collapsed items', () => {
      const mockExpand = jest.fn()
      const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} onExpandRequested={mockExpand} />)
      wrapper.find('.treeview__button button').at(1).simulate('click')
      expect(mockExpand).toHaveBeenCalledTimes(1)
      expect(mockCallPath(mockExpand)).toEqual([0])
    })
  })

  describe('a11y and aria', () => {
    it('sets tabIndex=0 on one item', () => {
      const wrapper = mount(<TreeView structure={FlatTree} />)
      const instance = wrapper.instance()

      instance.handleNewFocusedPath([0])
      expect(wrapper.find('li[tabIndex="0"]').text()).toMatch(/first/)

      instance.handleNewFocusedPath([1])
      expect(wrapper.find('li[tabIndex="0"]').text()).toMatch(/second/)
    })

    it('uses one tree role', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('[role="tree"]').length).toBe(1)
    })

    it('uses group role on ul', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('ul[role="group"]').length).toBe(3)
    })

    it('uses treeitem role on li', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('li[role="treeitem"]').length).toBe(7)
    })

    it('sets aria-expanded to true when expanded', () => {
      const wrapper = mount(<TreeView structure={OneDeep} />)
      expect(wrapper.find('li[aria-expanded=true]').length).toBe(3)
    })

    it('sets aria-expanded to false when collapsed', () => {
      const wrapper = mount(<TreeView structure={OneDeepFirstCollapsed} />)
      expect(wrapper.find('li[aria-expanded=true]').length).toBe(2)
      expect(wrapper.find('li[aria-expanded=false]').length).toBe(1)
    })

    it('adds level to aria-label on items', () => {
      const wrapper = mount(<TreeView structure={FlatTree} />)
      const labels = wrapper.find('li').map((li) => li.prop('aria-label'))
      expect(labels.length).toBe(3)
      // can't test level values because of missing translations in test
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

    it('does not focus hidden files', () => {
      const structure = _.clone(TwoDeep)
      structure.files[0].files[1].expanded = false
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
      expect(mockCallPath(expandMock)).toEqual([0])
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
      expect(mockCallPath(collapseMock)).toEqual([0])
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
      structure.files[0].files[1].expanded = false
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

    it('collapses root when focused at root', () => {
      const collapseMock = jest.fn()
      const wrapper = mount(<TreeView
        structure={FlatTree}
        simulateFocus={true}
        onCollapseRequested={collapseMock}
      />)
      const instance = wrapper.instance()
      instance.handleNewFocusedPath([])
      instance.handleItemKey(pseudoKeyEvent('ArrowLeft'))
      expect(instance.getFocusedPath()).toEqual([])
      expect(mockCallPath(collapseMock)).toEqual([])
    })
  })
})
