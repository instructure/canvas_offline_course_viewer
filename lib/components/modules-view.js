import React from 'react'
import I18n from 'i18n-js'
import IconFolderSolid from 'instructure-icons/react/Solid/IconFolderSolid'
import IconLockSolid from 'instructure-icons/react/Solid/IconLockSolid'
import {Typography, Table, ScreenReaderContent} from 'instructure-ui'
import ModuleItem from './module-item'
import FlexLink from './flex-link'
import moment from 'moment'

require('./modules-view.scss')

export default class ModulesView extends React.Component {
  mapModuleNames (prereqs) {
    return prereqs.map((prereq) => {
      const module = this.props.modules.find((mod) =>
        prereq === mod['id']
      )
      return module['name']
    }).join(', ')
  }

  renderPrerequisites (prereqs) {
    if (prereqs === null || prereqs.length === 0) {
      return null
    }
    return (
      <span className="modules__prerequisites">
        <Typography size="x-small">
          {I18n.t('Prerequisites: %{prereqs}', {prereqs: this.mapModuleNames(prereqs)})}
        </Typography>
      </span>
    )
  }

  renderCompletionReqs (requirement) {
    let reqString = null
    if (requirement === null) {
      return null
    } else if (requirement === 'all') {
      reqString = I18n.t('Complete All Items')
    } else {
      reqString = I18n.t('Complete One Item')
    }
    return (
      <Typography size="x-small">
        <span className="modules__completion-pill">{reqString}</span>
      </Typography>
    )
  }

  renderStatusIcon (module) {
    let icon = null
    let title = I18n.t('Locked')
    if (module.unlockDate !== null) {
      title = I18n.t('Locked until %{date}', {date: moment.parseZone(module.unlockDate).format('lll')})
    }
    if (module.status === 'locked') {
      icon = <span className="modules__status-icon">
        <ScreenReaderContent>{title}</ScreenReaderContent>
        <IconLockSolid />
      </span>
    }
    return icon
  }

  renderModuleAccessDetails (module) {
    return (
      <div className="modules__access-details">
        {this.renderPrerequisites(module.prereqs)}
        {this.renderCompletionReqs(module.requirement)}
        {this.renderStatusIcon(module)}
      </div>
    )
  }

  renderLockDate (unlockDate) {
    if (unlockDate === null) return null
    return (
      <div className="modules__lock-date">
        <Typography size="x-small">
          {I18n.t('Will unlock online %{date}', {date: moment.parseZone(unlockDate).format('lll')})}
        </Typography>
      </div>
    )
  }

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
          <div className="module__attributes-wrapper">
            <span className="module__name">
              <Typography weight="light">{module.name}</Typography>
            </span>
            {this.renderModuleAccessDetails(module)}
          </div>
          <Table size="large" caption={<ScreenReaderContent>{I18n.t('module items')}</ScreenReaderContent>}>
            <tbody>
              {moduleItems}
            </tbody>
          </Table>
          {this.renderLockDate(module.unlockDate)}
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
    status: React.PropTypes.string,
    unlockDate: React.PropTypes.string,
    requirement: React.PropTypes.string,
    items: React.PropTypes.arrayOf(React.PropTypes.object),
    prereqs: React.PropTypes.arrayOf(React.PropTypes.number),
  })),
}
