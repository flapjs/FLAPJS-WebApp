//https://material.io/tools/icons/?icon=cloud_download&style=outline
import React from 'react';
import Downloader from 'util/Downloader.js';

class ExportButton extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  onClick(ev)
  {
    const workspace = this.props.workspace;
    Downloader.downloadSVG(this.props.getFileName() + '.png', workspace.ref);
  }

  render()
  {
    return <button className="toolbar-button" id="toolbar-undo"
                   onClick={this.onClick.bind(this)}>
      <svg className="navicons" viewBox="0 0 24 24">
        <path d="M23,12L19,8V11H10V13H19V16M1,18V6C1,4.89 1.9,4 3,4H15A2,2 0 0,1 17,6V9H15V6H3V18H15V15H17V18A2,2 0 0,1 15,20H3A2,2 0 0,1 1,18Z" />
      </svg>
    </button>;
  }
}

export default ExportButton;
