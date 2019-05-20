import React from 'react';
import './InfoBlock.css';

import IconToggle from 'deprecated/icons/IconToggle.js';
import DropDownIcon from 'deprecated/icons/DropDownIcon.js';

//TODO: Should be deprecated to use OptionGroup (or something similar)
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
        return <div className={'infoblock-container ' + this.props.className}>
            <div className="infoblock-header" onClick={(e)=>this.dropdown.onClick(e)}>
                <label>{this.props.title}</label>
                <IconToggle id="collapse" ref={ref=>this.dropdown=ref} defaultValue={this.props.defaultValue}
                    style={{pointerEvents: 'none'}}>
                    <DropDownIcon/>
                </IconToggle>
            </div>
            <div className="infoblock-content"
                style={{display: this.isOpen() ? 'block' : 'none'}}>
                {this.props.children}
            </div>
        </div>;
    }
}

export default InfoBlock;
