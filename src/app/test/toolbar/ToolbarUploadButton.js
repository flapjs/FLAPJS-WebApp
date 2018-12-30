import React from 'react';
import Style from './ToolbarUploadButton.css';

import IconButton from 'test/components/IconButton.js';

class ToolbarUploadButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const IconClass = this.props.icon;
    const title = this.props.title;

    return (
      <IconButton id={this.props.id}
        className={Style.upload_input_container +
          " " + this.props.className}
        style={this.props.style}
        title={title}
        disabled={this.props.disabled}>
        <input type="file" name="import"
          className={Style.upload_input}
          accept={this.props.accept}
          onChange={this.props.onUpload}/>
        {IconClass && <IconClass/>}
        <label>{title}</label>
      </IconButton>
    );
  }
}

export default ToolbarUploadButton;
