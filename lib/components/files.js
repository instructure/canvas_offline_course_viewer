import React from 'react'
import I18n from 'i18n-js'
import IconFolderSolid from 'instructure-icons/react/Solid/IconFolderSolid'
import IconDocumentLine from 'instructure-icons/react/Line/IconDocumentLine'
import natcompare from '../util/natcompare'

require('./files.scss')

export default class Files extends React.Component {
  static propTypes = {
    files: React.PropTypes.arrayOf(Object),
    lang: React.PropTypes.string,
  }

  constructor (props) {
    super(props)
    document.documentElement.setAttribute('lang', this.props.lang || 'en')
    this.fileHeaders = [I18n.t('Name'), I18n.t('Size')]
  }

  filterFiles (type = 'file') {
    return this.props.files.filter(file =>
      file.type === type
    )
  }

  renderFoldersFiles () {
    const folders = this.filterFiles('folder').sort(natcompare.strings)
    const files = this.filterFiles().sort(natcompare.strings)
    const filesAndFolders = folders.concat(files)
    if (filesAndFolders.length === 0) {
      return <tr>
        <td>{I18n.t('This folder is empty')}</td>
        <td />
      </tr>
    }
    return filesAndFolders.map(file => {
      let icon = <IconDocumentLine />
      let size = file.size
      if (file.type === 'folder') {
        icon = <IconFolderSolid />
        size = '--'
      }
      return <tr key={file.name}>
        <td><span aria-hidden="true">{icon}</span> {file.name}</td>
        <td>{size}</td>
      </tr>
    })
  }

  renderHeaders () {
    return this.fileHeaders.map(header =>
      <th key={header}>{header}</th>
    )
  }

  renderFilesList () {
    return <table className="file-table">
      <thead>
        <tr>
          {this.renderHeaders()}
        </tr>
      </thead>
      <tbody>
        {this.renderFoldersFiles()}
      </tbody>
    </table>
  }

  render () {
    return <div className="files">
      <aside className="folders">{I18n.t('Folders')}</aside>
      <div className="file-list-wrapper" aria-label={I18n.t('File List')}>
        {this.renderFilesList()}
      </div>
    </div>
  }
}
