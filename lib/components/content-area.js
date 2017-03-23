import React from 'react'
import ReactDOM from 'react-dom'
import {Typography} from 'instructure-ui'
import ExternalLinkIndicator from './external-link-indicator'

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
    // don't duplicate links (weird interaction with Safari's bfcache)
    const existingExternalLinkIndicators =
      this.htmlSpan.getElementsByClassName(ExternalLinkIndicator.outerClass)
    if (existingExternalLinkIndicators.length !== 0) return

    const externalLinks = this.htmlSpan.querySelectorAll('a[href*="://"]')
    // jest's DOM doesn't implement forEach on NodeList, so loop manually
    for (let i = 0; i < externalLinks.length; ++i) {
      const link = externalLinks[i]
      // make external links open in a new window
      link.setAttribute('target', '_blank')
      const parentElement = link.parentElement
      parentElement.insertBefore(this.renderExternalLinkIndicator(), link.nextSibling)
    }
  }

  renderExternalLinkIndicator () {
    const element = document.createElement('span')
    ReactDOM.render(<ExternalLinkIndicator />, element)
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
