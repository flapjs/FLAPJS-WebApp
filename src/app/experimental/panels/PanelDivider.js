import React from 'react';
import Style from './PanelDivider.css';

class PanelDivider extends React.Component
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
                className={Style.panel_divider +
          ' ' + this.props.className}
                style={this.props.style}>
            </div>
        );
    }
}

export default PanelDivider;
