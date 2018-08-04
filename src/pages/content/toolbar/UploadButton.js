import React from 'react';

import GraphUploader from 'graph/GraphUploader.js';

const FILETYPE_JSON = "application/json";
const FILETYPE_JFLAP = ".jff";

class UploadButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onUploadFileChange = this.onUploadFileChange.bind(this);
  }

  onUploadFileChange(e)
  {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileType = file.type || fileName.substring(fileName.lastIndexOf('.'));
    if (fileType === FILETYPE_JSON)
    {
      GraphUploader.uploadFileToGraph(file, this.props.graph, this.props.onChange);
    }
    else if (fileType === FILETYPE_JFLAP)
    {
      GraphUploader.uploadJFFToGraph(file, this.props.graph, this.props.onChange);
    }
    else
    {
      throw new Error("Unknown file type\'" + fileType + "\'");
    }
  }

  render()
  {
    const inputID = this.props.id + "-input";
    return <button
      className={"icon-button button-upload " + this.props.className}
      id={this.props.id}
      title={this.props.title}
      style={this.props.style}
      disabled={this.props.disabled}
      onClick={this.props.onClick}>
      <input id={inputID} type="file" name="import"
        style={{display:"none"}}
        onChange={this.onUploadFileChange}
        accept={FILETYPE_JSON + "," + FILETYPE_JFLAP}/>
      <label htmlFor={inputID}>
        {this.props.children}
      </label>
    </button>;
  }
}

export default UploadButton;
