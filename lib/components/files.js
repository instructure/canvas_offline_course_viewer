import React from 'react'
import I18n from 'i18n-js'
import IconFolderSolid from 'instructure-icons/react/Solid/IconFolderSolid'
import IconDocumentLine from 'instructure-icons/react/Line/IconDocumentLine'
import Link from 'instructure-ui/lib/components/Link'
import * as natcompare from '../util/natcompare'

require('./files.scss')

export default class Files extends React.Component {
  static propTypes = {
    files: React.PropTypes.arrayOf(Object),
    lang: React.PropTypes.string,
    onFolderClick: React.PropTypes.func.isRequired,
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

  renderFolder (folder) {
    return <tr key={folder.name}>
      <td className="file__link">
        <Link href="#" onClick={() => this.props.onFolderClick(folder.files)}>
          <IconFolderSolid className="file__icon" />
          <span className="file-name">{folder.name}</span>
        </Link>
      </td>
      <td>--</td>
    </tr>
  }

  renderFile (file) {
    return <tr key={file.name}>
      <td className="file__link">
        <IconDocumentLine className="file__icon" />{file.name}
      </td>
      <td>{file.size}</td>
    </tr>
  }

  renderFoldersFiles () {
    const folders = this.filterFiles('folder').sort(natcompare.byKey('name'))
    const files = this.filterFiles().sort(natcompare.byKey('name'))
    const filesAndFolders = folders.concat(files)
    if (filesAndFolders.length === 0) {
      return <tr>
        <td>{I18n.t('This folder is empty')}</td>
        <td />
      </tr>
    }
    return filesAndFolders.map(file => {
      if (file.type === 'folder') {
        return this.renderFolder(file)
      }
      return this.renderFile(file)
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
