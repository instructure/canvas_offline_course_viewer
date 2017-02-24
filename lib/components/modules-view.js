import React from 'react'
import I18n from 'i18n-js'
import IconFolderSolid from 'instructure-icons/react/Solid/IconFolderSolid'
import {Typography, Table, ScreenReaderContent} from 'instructure-ui'
import ModuleItem from './module-item'
import FlexLink from './flex-link'

require('./modules-view.scss')

export default class ModulesView extends React.Component {
  renderModuleItems (items) {
    return items.map((item, key) => {
      return <ModuleItem key={key} item={item} />
    })
  }

  renderModules () {
    return this.props.modules.map(module => {
      const moduleItems = this.renderModuleItems(module.items)
      return (
        <div className="module-item__wrapper" key={module.id}>
          <Typography weight="light">{module.name}</Typography>
          <Table size="large" caption={<ScreenReaderContent>{I18n.t('module items')}</ScreenReaderContent>}>
            <tbody>
              {moduleItems}
            </tbody>
          </Table>
        </div>
      )
    })
  }

  render () {
    const modules = this.renderModules()
    return <div className="body">
      <div className="modules__folder-icon-wrapper">
        <FlexLink href="files">
          <IconFolderSolid className="modules__folder-icon" />
          <Typography size="small">{I18n.t('Files')}</Typography>
        </FlexLink>
      </div>
      {modules}
    </div>
  }
}

ModulesView.propTypes = {
  modules: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    locked: React.PropTypes.bool,
    items: React.PropTypes.arrayOf(React.PropTypes.object),
  })),
}
