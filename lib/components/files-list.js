import React from 'react'
import I18n from 'i18n-js'
import IconFolderSolid from 'instructure-icons/react/Solid/IconFolderSolid'
import IconDocumentLine from 'instructure-icons/react/Line/IconDocumentLine'
import FlexLink from './flex-link'
import * as natcompare from '../util/natcompare'
import friendlyBytes from '../util/friendlyBytes'

require('./files-list.scss')

export default class FilesList extends React.Component {
  constructor (props) {
    super(props)
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
        <FlexLink
          aria-label={I18n.t('view %{foldername} contents', {foldername: folder.name})}
          onClick={() => this.props.onFolderClick(folder)}>
          <IconFolderSolid className="file__icon" />
          <span className="file-name">{folder.name}</span>
        </FlexLink>
      </td>
      <td className="file__size">--</td>
    </tr>
  }

  renderFile (file) {
    const filePathStrings = this.props.fileLinkPrefix.concat(file.name)
    const escapedFilePathStrings = filePathStrings.map(name => encodeURIComponent(name))
    return <tr key={file.name}>
      <td className="file__link">
        <FlexLink
          aria-label={I18n.t('open %{filename}', {filename: file.name})}
          href={escapedFilePathStrings.join('/')} >
          <IconDocumentLine className="file__icon" />
          <span className="file-name">{file.name}</span>
        </FlexLink>
      </td>
      <td className="file__size">{friendlyBytes(file.size)}</td>
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
    return <div aria-label={I18n.t('File List')}>
      {this.renderFilesList()}
    </div>
  }
}

FilesList.propTypes = {
  files: React.PropTypes.arrayOf(Object),
  onFolderClick: React.PropTypes.func, // (folder)
  onFileClick: React.PropTypes.func, // (file)
  fileLinkPrefix: React.PropTypes.arrayOf(React.PropTypes.string),
}

FilesList.defaultProps = {
  fileLinkPrefix: [],
}
