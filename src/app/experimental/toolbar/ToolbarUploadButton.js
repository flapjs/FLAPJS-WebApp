import React from 'react';

import ToolbarButtonStyle from './ToolbarButton.css';
import IconUploadButton from 'experimental/components/IconUploadButton.js';

class ToolbarUploadButton extends React.Component
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
            <IconUploadButton id={this.props.id}
                className={ToolbarButtonStyle.toolbar_button +
          ' ' + this.props.className}
                style={this.props.style}
                title={this.props.title}
                disabled={this.props.disabled}
                accept={this.props.accept}
                onUpload={this.props.onUpload}>
                <IconClass/>
            </IconUploadButton>
        );
    }
}

export default ToolbarUploadButton;
