import React from 'react';
import Style from './PanelContainer.css';

class PanelContainer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const title = this.props.title;

        return (
            <div id={this.props.id}
                className={Style.panel_container +
                    ' ' + this.props.className}
                style={this.props.style}>
                <div className={Style.panel_title}>
                    <h1>{title}</h1>
                </div>
                <div className={Style.panel_content}>
                    {this.props.children}
                </div>
                <div className={Style.panel_bottom}>
                </div>
            </div>
        );
    }
}

export default PanelContainer;
