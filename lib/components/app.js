import React from 'react'
import I18n from 'i18n-js'
import moment from 'moment'
import PageHeader from './page-header'
import PageFooter from './page-footer'
import ModulesView from './modules-view'
import FilesView from './files-view'
import ContentPage from './content-page'

require('./app.scss')

export default class App extends React.Component {
  static get propTypes () {
    return {
      course: React.PropTypes.object,
      content: React.PropTypes.object, // maps exportIds/ids to items
      viewName: React.PropTypes.oneOf(['modules', 'files', 'content']),
      exportId: React.PropTypes.string,
    }
  }

  static get defaultProps () {
    return {
      viewName: 'modules',
      exportId: null,
    }
  }

  constructor (props) {
    super(props)

    document.documentElement.setAttribute('lang', this.props.course.language || 'en')
    moment.locale(this.props.course.language || 'en')
  }

  findCurrentContentObject () {
    return this.props.content[this.props.exportId]
  }

  flatModuleItems () {
    return this.props.course.modules.reduce(
      (items, mod) => items.concat(mod.items), [])
  }

  canViewItem (item) {
    return item && !item.locked && item.type !== 'ContextModuleSubHeader'
  }

  findPreviousId (incrementor = 1) {
    const moduleItems = this.flatModuleItems()
    let previousExportId = null
    let i = incrementor > 0 ? 0 : moduleItems.length - 1
    for (; i >= 0 && i < moduleItems.length; i += incrementor) {
      const currentItem = moduleItems[i]
      const currentItemExportId = currentItem.exportId || currentItem.id.toString()
      if (currentItemExportId === this.props.exportId) {
        return previousExportId
      }
      if (this.canViewItem(currentItem)) {
        previousExportId = currentItemExportId
      }
    }
    return null
  }

  findNextId () {
    return this.findPreviousId(-1)
  }

  renderBody () {
    switch (this.props.viewName) {
      case 'modules':
        return <ModulesView modules={this.props.course.modules} />
      case 'files':
        return <FilesView />
      default:
        return <ContentPage
          item={this.findCurrentContentObject()}
          courseName={this.props.course.title}
          prevId={this.findPreviousId()}
          nextId={this.findNextId()}
        />
    }
  }

  renderBreadcrumbString () {
    switch (this.props.viewName) {
      case 'modules':
        return I18n.t('Modules')
      case 'files':
        return I18n.t('Files')
      default:
        return this.findCurrentContentObject().title
    }
  }

  render () {
    return <div>
      <PageHeader course={this.props.course} breadcrumb={this.renderBreadcrumbString()} />
      {this.renderBody()}
      <PageFooter />
    </div>
  }
}
