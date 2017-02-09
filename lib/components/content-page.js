import React from 'react'
import {Button, Typography} from 'instructure-ui'

export default class ContentPage extends React.Component {

  render () {
    return <div className="body">
      <Typography>{this.props.item.title}</Typography>
      <div>
        <Button
          variant="primary"
          size="small"
          onClick={() => this.props.switchView('modules')}
        ><Typography size="x-small" weight="light">{this.props.courseName}</Typography></Button>
      </div>
    </div>
  }
}

ContentPage.propTypes = {
  item: React.PropTypes.shape({
    id: React.PropTypes.number,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    completed: React.PropTypes.bool,
    pointsPossible: React.PropTypes.number,
    content: React.PropTypes.text,
  }),
  switchView: React.PropTypes.func,
  courseName: React.PropTypes.string,
}
