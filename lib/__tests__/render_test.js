/* eslint-env jest */

import {findItemByExportId} from '../render'

const store = {
  getState: function () {
    const modules = [
      {
        id: 1,
        title: 'Module 1',
        exportId: 'module_1',
        items: [
          {
            id: 2,
            type: 'Assignment',
            title: 'Assignment 1',
            exportId: 'assignment_1',
          },
        ],
      },
    ]
    return {course: {modules: modules}}
  },
}

describe('findItemByExportId', () => {
  it('finds the content ID for render', () => {
    const item = findItemByExportId('assignment_1', store)
    expect(item.id).toBe(2)
  })
})
