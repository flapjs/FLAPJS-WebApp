import React from 'react';
import './OptionGroup.css';

import IconToggle from 'deprecated/icons/IconToggle.js';
import DropDownIcon from 'deprecated/icons/DropDownIcon.js';

class OptionGroup extends React.Component
{
  constructor(props)
  {
    super(props);

    this.dropdown = React.createRef();
  }

  isOpen()
  {
    return this.dropdown.state ? this.dropdown.state.open : false;
  }

  render()
  {
    return <div className={"option-group " + this.props.className}>
      <div className="option-header" onClick={(e)=>this.dropdown.onClick(e)}>
        <label>{this.props.title}</label>
        <label>({this.props.label})</label>
        <IconToggle id="collapse" ref={ref=>this.dropdown=ref} defaultValue={this.props.defaultValue}
          style={{pointerEvents: "none"}}>
          <DropDownIcon/>
        </IconToggle>
      </div>
      <div className="option-content"
        style={{display: this.isOpen() ? "block" : "none"}}>
        { this.props.children }
      </div>
    </div>;
  }
}

export default OptionGroup;
