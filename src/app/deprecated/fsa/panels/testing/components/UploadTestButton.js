import React from 'react';

class UploadTestButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <button
            className={'icon-button ' + this.props.className}
            id={this.props.id}
            title={this.props.title}
            style={this.props.style}
            disabled={this.props.disabled}
            onClick={this.props.onClick}>
            <input ref={ref=>this.uploadInput=ref}
                id="test-upload-input" type="file" name="import"
                style={{display: 'none'}}
                onChange={this.props.onChange} accept=".txt"/>
            <label htmlFor="test-upload-input">
                {this.props.children}
            </label>
        </button>;
    }
}

export default UploadTestButton;
