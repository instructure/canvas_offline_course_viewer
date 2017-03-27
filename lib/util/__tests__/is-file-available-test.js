/* eslint-env jest */

import {isFileAvailable} from '../file-utils'

describe('isFileAvailable', () => {
  const courseFixture = {
    files: [
      {type: 'file', name: 'root-file'},
      {
        type: 'folder',
        name: 'some-folder',
        files: [
          {type: 'file', name: 'other-file.foo'},
          {type: 'folder', name: 'other-folder', files: []},
          {type: 'file', name: 'folder-file.bar'},
          {
            type: 'folder',
            name: 'deep-folder',
            files: [
              {type: 'folder', name: 'other-folder', files: []},
              {type: 'file', name: 'deep-folder-file.baz'},
            ],
          },
        ],
      },
    ],
  }

  it('finds root files', () => {
    expect(isFileAvailable(courseFixture, 'root-file')).toBe(true)
  })

  it('finds deep files', () => {
    const deepPath = 'some-folder/deep-folder/deep-folder-file.baz'
    expect(isFileAvailable(courseFixture, deepPath)).toBe(true)
  })

  it('fails to find non-existent files', () => {
    const badPath = 'some-folder/deep-folder/does-not-exist.blah'
    expect(isFileAvailable(courseFixture, badPath)).toBe(false)
  })

  it('does not treat folders as files', () => {
    expect(isFileAvailable(courseFixture, 'some-folder')).toBe(false)
  })

  it('strips the leading slash if there is one', () => {
    expect(isFileAvailable(courseFixture, '/root-file')).toBe(true)
  })
})
