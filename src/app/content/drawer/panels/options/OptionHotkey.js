import React from 'react';
import './OptionHotkey.css';

class OptionHotkey extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className={"option-container option-hotkey " + this.props.className}>
      <label>{this.props.label}</label>
      <span>{this.props.keyName}</span>
    </div>;
  }
}

export default OptionHotkey;
