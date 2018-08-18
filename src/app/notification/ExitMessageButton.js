import React from 'react';
import './ExitMessageButton.css';

const DEFAULT_BUTTON_TEXT = "Get out of my way!";

class ExitMessageButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <button onClick={this.props.onClick}>{this.props.label || DEFAULT_BUTTON_TEXT}</button>;
  }
}
export default ExitMessageButton;
