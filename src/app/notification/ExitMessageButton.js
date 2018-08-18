import React from 'react';

class ExitMessageButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <button className={this.props.className} onClick={this.props.onClick}>
      {this.props.label || I18N.toString("CLOSE_MESSAGE")}
    </button>;
  }
}
export default ExitMessageButton;
