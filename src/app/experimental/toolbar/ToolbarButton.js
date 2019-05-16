import React from 'react';
import Style from './ToolbarButton.css';

import IconButton from 'experimental/components/IconButton.js';

export const TOOLBAR_CONTAINER_MENU = 'menu';
export const TOOLBAR_CONTAINER_TOOLBAR = 'toolbar';
export const TOOLBAR_CONTAINER_ALL = 'all';

class ToolbarButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const IconClass = this.props.icon;
        return (
            <IconButton id={this.props.id}
                className={Style.toolbar_button + ' ' + this.props.className}
                style={this.props.style}
                title={this.props.title}
                disabled={this.props.disabled}
                onClick={this.props.onClick}>
                <IconClass/>
            </IconButton>
        );
    }
}

export default ToolbarButton;
