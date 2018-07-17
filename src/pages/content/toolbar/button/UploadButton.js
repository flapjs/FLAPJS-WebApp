//https://material.io/tools/icons/?icon=cloud_upload&style=outline
import React from 'react';

class UploadButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {

  }

  render()
  {
    return(
      <form onSubmit={this.onClick}>
        <input id="import-file" type="file" name="import" accept="application/json"/>
        <label for="import-file">
        <button className="toolbar-button" id="toolbar-undo" onClick={this.onClick.bind(this)}>
          <svg className="navicons" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
            <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
          </svg>
        </button>
        </label>
      </form>
    );
  }
}

export default UploadButton;
