import React from 'react';
import './InfoBlock.css';

import IconToggle from 'icons/IconToggle.js';
import DropDownIcon from 'icons/DropDownIcon.js';

class InfoBlock extends React.Component
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
    return <div className="infoblock-container">
      <div className="infoblock-header">
        <label onClick={(e)=>this.dropdown.onClick(e)}>{this.props.title}</label>
        <IconToggle id="collapse" ref={ref=>this.dropdown=ref}>
          <DropDownIcon/>
        </IconToggle>
      </div>
      <div className="infoblock-content"
        style={{display: this.isOpen() ? "block" : "none"}}>
        {this.props.children}
      </div>
    </div>;
  }
}

export default InfoBlock;
