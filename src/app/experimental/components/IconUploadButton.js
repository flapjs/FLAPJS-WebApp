import React from 'react';
import Style from './IconUploadButton.css';

import IconButton from './IconButton.js';

class IconUploadButton extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onFileUpload = this.onFileUpload.bind(this);
    }

    onFileUpload(e)
    {
        const files = e.target.files;
        if (files.length > 0)
        {
            if (this.props.onUpload) this.props.onUpload(files[0]);

            //Makes sure you can upload the same file again.
            e.target.value = '';
        }
    }

    /** @override */
    render()
    {
        const accept = this.props.accept;

        return (
            <IconButton id={this.props.id}
                className={Style.upload_button +
          ' ' + this.props.className}
                style={this.props.style}
                title={this.props.title}
                disabled={this.props.disabled}>
                <input type="file" name="import"
                    className={Style.upload_input}
                    disabled={this.props.disabled}
                    accept={accept}
                    onChange={this.onFileUpload}/>
                {this.props.children}
            </IconButton>
        );
    }
}

export default IconUploadButton;
