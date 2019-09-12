import React from 'react';
import Style from './PanelButton.css';

class PanelButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <button id={this.props.id}
                className={Style.button_container +
          ' ' + this.props.className}
                style={this.props.style}
                onClick={this.props.onClick}>
                {this.props.children}
            </button>
        );
    }
}

export default PanelButton;
