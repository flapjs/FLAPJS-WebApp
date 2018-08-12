import React from 'react';
import './OptionGroup.css';

class OptionGroup extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className={"option-group " + this.props.className}>
      <div className="option-header">
        <label>{this.props.title}</label>
        <label>({this.props.label}}</label>
      </div>
      <div className="option-content">
        { this.props.children }
      </div>
    </div>;
  }
}

export default OptionGroup;
