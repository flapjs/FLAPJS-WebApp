import React from 'react';
import '../Panel.css';
import './ExportingPanel.css';

import Downloader from 'util/Downloader.js';

import IconButton from 'icons/IconButton.js';
import PNGIcon from 'icons/flat/PNGIcon.js';
import JPGIcon from 'icons/flat/JPGIcon.js';
import JSONIcon from 'icons/flat/JSONIcon.js';
import XMLIcon from 'icons/flat/XMLIcon.js';

class ExportingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();
  }

  render()
  {
    const graph = this.props.graph;
    const toolbar = this.props.toolbar;
    const workspace = this.props.workspace;
    const controller = this.props.controller;

    return <div className="panel-container" id="exporting" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>{I18N.toString("component.exporting.title")}</h1>
      </div>
      <div className="panel-content">
        {/*JSON*/}
        <IconButton className="export-button" id="export-json" title={I18N.toString("file.export.machine.hint")}
          onClick={()=>Downloader.downloadText(toolbar.getMachineName() + '.json', JSON.stringify(graph.toJSON()))}>
          <JSONIcon/>
          <label>{I18N.toString("file.export.machine")}</label>
        </IconButton>
        {/*PNG*/}
        <IconButton className="export-button" id="export-png" title={I18N.toString("file.export.png.hint")}
          onClick={() => {
            const workspaceDim = workspace.ref.viewBox.baseVal;
            const width = workspaceDim.width;
            const height = workspaceDim.height;
            const svg = workspace.getSVGForExport(width, height);
            Downloader.downloadSVG(toolbar.getMachineName(), 'png', svg, width, height);
          }}>
          <PNGIcon/>
          <label>{I18N.toString("file.export.png")}</label>
        </IconButton>
        {/*JPG*/}
        <IconButton className="export-button" id="export-jpg" title={I18N.toString("file.export.jpg.hint")}
          onClick={() => {
            const workspaceDim = workspace.ref.viewBox.baseVal;
            const width = workspaceDim.width;
            const height = workspaceDim.height;
            const svg = workspace.getSVGForExport(width, height);
            Downloader.downloadSVG(toolbar.getMachineName(), 'jpg', svg, width, height);
          }}>
          <JPGIcon/>
          <label>{I18N.toString("file.export.jpg")}</label>
        </IconButton>
        {/*XML*/}
        <IconButton className="export-button" id="export-xml" title={I18N.toString("file.export.jff.hint")}
          disabled="true">
          {/*TODO: Add JFLAP export functionality*/}
          <XMLIcon/>
          <label>{I18N.toString("file.export.jff")}</label>
        </IconButton>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default ExportingPanel;
