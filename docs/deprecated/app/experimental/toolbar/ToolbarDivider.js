import React from 'react';
import Style from './ToolbarDivider.css';

class ToolbarDivider extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <div id={this.props.id}
                className={Style.divider + ' ' + this.props.className}
                style={this.props.style}>
            </div>
        );
    }
}

export default ToolbarDivider;
