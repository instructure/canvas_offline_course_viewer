/* eslint-env jest */

import findNode from '../../util/find-node'
import {OneDeepFirstCollapsed, TwoDeep} from '../../fixtures/file-structure-fixtures'
import * as actions from '../actions'
import reducer from '../reducer'

const courseFixture = {
  title: 'test course',
  files: [TwoDeep],
}

function stateWithCourse (files = TwoDeep) {
  const initialState = reducer(undefined, {type: 'NOOP'})
  return reducer(initialState, actions.initializeCourse(courseFixture))
}

it('expands items', () => {
  const courseState = stateWithCourse(OneDeepFirstCollapsed)
  const newCourseState = reducer(courseState,
    actions.expandFolder(findNode(courseState.structure, [0])))
  expect(findNode(newCourseState.structure, [0]).expanded).toBe(true)
})

it('collapses items', () => {
  const courseState = stateWithCourse()
  const newCourseState = reducer(courseState,
    actions.collapseFolder(findNode(courseState.structure, [0])))
  expect(findNode(newCourseState.structure, [0]).expanded).toBe(false)
})

it('reveals folders', () => {
  const courseState = stateWithCourse()
  courseState.structure.expanded = false
  courseState.structure.files[0].expanded = false
  const newCourseState = reducer(courseState, actions.revealFolderPath([0, 0]))
  expect(newCourseState.structure.expanded).toBe(true)
  expect(newCourseState.structure.files[0].expanded).toBe(true)
  expect(newCourseState.currentFolderPath).toEqual([0, 0])
})

it('saves course data', () => {
  const courseState = stateWithCourse()
  expect(courseState.course.title).toBe('test course')
})
