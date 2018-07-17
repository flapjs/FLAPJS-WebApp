//https://material.io/tools/icons/?icon=cloud_download&style=outline
import React from 'react';

class DownloadButton extends React.Component
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
    return <button className="toolbar-button" id="toolbar-undo"
                   onClick={this.onClick.bind(this)}>
      <svg className="navicons" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24">
        <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
      </svg>
    </button>;
  }
}

export default DownloadButton;
