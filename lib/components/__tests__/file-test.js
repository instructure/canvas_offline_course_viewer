/* eslint-env jest */

import React from 'react'
import Files from '../files'
import { mount } from 'enzyme'

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
    const wrapper = mount(<Files files={data} />)
    expect(wrapper.find('.file-table tbody tr')).toHaveLength(2)
  })

  it('should show return headers', () => {
    const data = []
    const wrapper = mount(<Files files={data} />)
    expect(wrapper.find('.file-table th')).toHaveLength(2)
  })
})
