//https://material.io/tools/icons/?icon=cloud_upload&style=outline
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
    const file  = e.target.files[0];
    const fileType = file.type;
    if (fileType === FILETYPE_JSON)
    {
      GraphUploader.uploadFileToGraph(file, this.props.graph, this.props.onExecute);
    }
    else if (fileType === FILETYPE_JFLAP)
    {
      //GraphUploader.updateJFFToGraph(file, this.props.graph, this.props.onExecute);
    }
    else
    {
      throw new Error("Unknown file type\'" + fileType + "\'");
    }
  }

  render()
  {
    return(
      <button className="toolbar-button" id="toolbar-upload">
        <input id="toolbar-upload-input" type="file" name="import" style={{display:"none"}}
          onChange={this.onUploadFileChange} accept={FILETYPE_JSON + "," + FILETYPE_JFLAP}/>
        <label htmlFor="toolbar-upload-input">
          <svg className="navicons" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
            <title>Upload</title>
            <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
          </svg>
        </label>
      </button>
    );
  }
}

export default UploadButton;
