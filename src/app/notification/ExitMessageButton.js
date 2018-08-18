import React from 'react';
import { CLOSE_MESSAGE } from 'lang.js';

class ExitMessageButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <button className={this.props.className} onClick={this.props.onClick}>
      {this.props.label || CLOSE_MESSAGE}
    </button>;
  }
}
export default ExitMessageButton;
