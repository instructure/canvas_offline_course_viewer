import React from 'react'
import I18n from 'i18n-js'
import {Popover, PopoverTrigger, PopoverContent, ScreenReaderContent} from 'instructure-ui'
import {IconExportLine} from 'instructure-icons'

require('./external-link-indicator.scss')

export default class ExternalLinkIndicator extends React.Component {
  render () {
    const helpText = I18n.t('This is an external link.')
    return <span className={`${ExternalLinkIndicator.outerClass} external-link-indicator__wrapper`}>
      <Popover placement="top" variant="inverse">
        <PopoverTrigger>
          <IconExportLine height="0.8rem" tabIndex="0" />
        </PopoverTrigger>
        <PopoverContent><div className="external-link-indicator__popup-text">
          {helpText}
        </div></PopoverContent>
      </Popover>
      <ScreenReaderContent>{helpText}</ScreenReaderContent>
    </span>
  }
}

ExternalLinkIndicator.outerClass = 'external-link-indicator'
