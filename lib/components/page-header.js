import React from 'react'
import I18n from 'i18n-js'
import {Breadcrumb, BreadcrumbLink} from 'instructure-ui'

require('./page-header.scss')

export default class PageHeader extends React.Component {

  render () {
    return <div className='page-header'>
      <div className='page-header__breadcrumb'>
        <Breadcrumb label='navigation'>
          <BreadcrumbLink>{this.props.course.title}</BreadcrumbLink>
          <BreadcrumbLink>{this.props.breadcrumb || ''}</BreadcrumbLink>
        </Breadcrumb>
      </div>
      <span className='page-header__last-download'>
        {I18n.t('Last Export:')} {this.props.course.lastDownload}
      </span>
    </div>
  }
}

PageHeader.propTypes = {
  course: React.PropTypes.shape({
    title: React.PropTypes.string,
    lastDownload: React.PropTypes.string,
  }),
  breadcrumb: React.PropTypes.string,
}
