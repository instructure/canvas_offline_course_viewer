import React from 'react'
import ReactDOM from 'react-dom'
import I18n from 'i18n-js'
import {Popover, PopoverTrigger, PopoverContent, ScreenReaderContent, Typography} from 'instructure-ui'
import {IconExportLine} from 'instructure-icons'

require('./content-area.scss')

export default class ContentArea extends React.Component {
  static get propTypes () {
    return {
      content: React.PropTypes.string,
    }
  }

  componentDidMount () {
    this.addExternalLinkIndicators()
  }

  componentDidUpdate () {
    this.addExternalLinkIndicators()
  }

  addExternalLinkIndicators () {
    if (!this.htmlSpan) return

    const externalLinks = this.htmlSpan.querySelectorAll('a[href*="://"]')
    // jest's DOM doesn't implement forEach on NodeList, so loop manually
    for (let i = 0; i < externalLinks.length; ++i) {
      const link = externalLinks[i]
      const parentElement = link.parentElement
      parentElement.insertBefore(this.renderExternalLinkIndicator(), link.nextSibling)
    }
  }

  renderExternalLinkIndicator () {
    const element = document.createElement('span')
    const helpText = I18n.t('This is an external link.')
    // using a popover directly because using a tooltip renders as a link
    // and doesn't blend in with the rest of the content
    ReactDOM.render(
      <span className="content-area__external-link_wrapper">
        <Popover placement="top" variant="inverse">
          <PopoverTrigger>
            <IconExportLine height="0.8rem" tabIndex="0" />
          </PopoverTrigger>
          <PopoverContent><div className="content-area__external-link-popup-text">
            {helpText}
          </div></PopoverContent>
        </Popover>
        <ScreenReaderContent>{helpText}</ScreenReaderContent>
      </span>, element)
    return element
  }

  render () {
    return <Typography weight='light'>
      <span
        className='content__html-span'
        ref={(elt) => { this.htmlSpan = elt }}
        dangerouslySetInnerHTML={{__html: this.props.content}}>
      </span>
    </Typography>
  }
}
