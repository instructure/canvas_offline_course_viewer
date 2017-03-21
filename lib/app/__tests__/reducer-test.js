/* eslint-env jest */

import findNode from '../../util/find-node'
import {OneDeepFirstCollapsed, TwoDeep} from '../../fixtures/file-structure-fixtures'
import * as actions from '../actions'
import reducer from '../reducer'

const courseFixture = {
  title: 'test course',
  files: [TwoDeep],
  modules: [
    {items: [{id: 1, title: 'first mi', indent: 1}, {id: 2, exportId: 'p1', title: 'second mi', indent: 2}]},
    {items: [{id: 3, title: 'third mi', indent: 3}, {id: 4, exportId: 'q2', title: 'fourth mi', indent: 4}]},
  ],
  pages: [
    {exportId: 'p1', title: 'first page', frontPage: true},
    {exportId: 'p2', title: 'second page', frontPage: false},
  ],
  assignments: [
    {exportId: 'a1', title: 'some assignment'},
  ],
  discussion_topics: [
    {exportId: 'dt1', title: 'some discussion'},
    {exportId: 'dt2', title: 'assignment discussion', assignmentExportId: 'dt2a'},
  ],
  quizzes: [
    {exportId: 'q1', title: 'first quiz', assignmentExportId: 'q1a'},
    {exportId: 'q2', title: 'second quiz', assignmentExportId: 'q2a'},
  ],
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

it('catalogs module items and non-module content', () => {
  const courseState = stateWithCourse()
  expect(courseState.content).toMatchObject({
    '1': {title: 'first mi', indent: 1}, // 2 and 4 have exportIds so they don't appear here
    '3': {title: 'third mi', indent: 3},
    p1: {title: 'first page', type: 'WikiPage', indent: 2}, // make sure module item data is preserved
    frontPage: {title: 'first page', type: 'WikiPage'},
    p2: {title: 'second page', type: 'WikiPage'},
    a1: {title: 'some assignment', type: 'Assignment'},
    dt1: {title: 'some discussion', type: 'DiscussionTopic'},
    dt2: {title: 'assignment discussion', type: 'DiscussionTopic'},
    dt2a: {title: 'assignment discussion', type: 'DiscussionTopic'},
    q1: {title: 'first quiz', type: 'Quizzes::Quiz'},
    q2: {title: 'second quiz', type: 'Quizzes::Quiz', indent: 4},
    q1a: {title: 'first quiz', type: 'Quizzes::Quiz'},
    q2a: {title: 'second quiz', type: 'Quizzes::Quiz'},
  })
})
