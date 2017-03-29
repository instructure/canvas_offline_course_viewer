/* eslint-env jest */

import React from 'react'
import FilesList from '../files-list'
import * as enzyme from 'enzyme'

describe('files', () => {
  it('renders a list of folders and files', () => {
    const data = [
      {
        'type': 'file',
        'name': 'MS-XAML.pdf',
        'size': 2931726,
        'files': null,
      },
      {
        'type': 'folder',
        'name': 'Folder 1',
        'size': null,
        'files': [
          {
            'type': 'folder',
            'name': 'Folder 2',
            'size': null,
            'files': [
              {
                'type': 'file',
                'name': 'file2.docx',
                'size': 4,
                'files': null,
              },
            ],
          },
        ],
      },
    ]
    const wrapper = enzyme.mount(<FilesList files={data} onFolderClick={() => {}} />)
    expect(wrapper.find('.file-table tbody tr')).toHaveLength(2)
  })

  it('should show return headers', () => {
    const data = []
    const wrapper = enzyme.mount(<FilesList files={data} onFolderClick={() => {}} />)
    expect(wrapper.find('.file-table th')).toHaveLength(2)
  })

  it('clicking folder links should make callback', () => {
    const files = [
      {
        'type': 'file',
        'name': 'file2.docx',
        'size': 4,
        'files': null,
      },
    ]
    const data = [
      {
        'type': 'folder',
        'name': 'Folder 1',
        'size': null,
        'files': files,
      },
    ]
    const callback = jest.fn()
    const wrapper = enzyme.mount(<FilesList files={data} onFolderClick={callback} />)
    wrapper.find('button').simulate('click')
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(data[0])
  })

  it('should link to escaped file paths with path prefix', () => {
    const files = [{type: 'file', name: '!@#$%^&*().txt', size: 4, files: null}]
    const wrapper = enzyme.mount(<FilesList files={files} onFolderClick={() => {}} fileLinkPrefix={['Folder #1']}/>)
    const href = wrapper.find('Link').props().href
    expect(href).toBe('Folder%20%231/!%40%23%24%25%5E%26*().txt')
  })

  it('should use natural order for files/folders', () => {
    const data = [
      {
        'type': 'folder',
        'name': 'folder 10',
        'size': null,
        'files': null,
      },
      {
        'type': 'folder',
        'name': 'folder 1',
        'size': null,
        'files': null,
      },
      {
        'type': 'folder',
        'name': 'Folder 3',
        'size': null,
        'files': null,
      },
    ]
    const wrapper = enzyme.mount(<FilesList files={data} onFolderClick={() => {}} />)
    const expected = [/folder 1/, /Folder 3/, /folder 10/]
    wrapper.find('.file__link').forEach((node, index) => {
      expect(node.text()).toMatch(expected[index])
    })
  })

  it('should show file size in friendly format', () => {
    const data = [
      {
        'type': 'file',
        'name': 'file1.jpg',
        'size': 123456789,
        'files': null,
      },
    ]
    const wrapper = enzyme.mount(<FilesList files={data} onFolderClick={() => {}} />)
    const actual = wrapper.find('.file__size').text()
    expect(actual).toMatch(/123\.5 .*?MB/)
  })
})
