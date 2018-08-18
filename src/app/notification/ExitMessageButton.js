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
      {this.props.label || I18N.toString("message.action.close")}
    </button>;
  }
}
export default ExitMessageButton;
