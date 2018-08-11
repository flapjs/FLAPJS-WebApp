import React from 'react';
import '../Panel.css';
import './ExportingPanel.css';

import Downloader from 'util/Downloader.js';

import IconButton from 'icons/IconButton.js';
import PNGIcon from 'icons/flat/PNGIcon.js';
import JPGIcon from 'icons/flat/JPGIcon.js';
import JSONIcon from 'icons/flat/JSONIcon.js';
import XMLIcon from 'icons/flat/XMLIcon.js';

const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

class ExportingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();
  }

  prepareSVGForExport(svg, width, height)
  {
    const pointer = this.props.controller.pointer;
    const offsetX = pointer.offsetX;
    const offsetY = pointer.offsetY;
    const bounds = this.props.graph.getBoundingRect();

    const dx = bounds.minX + offsetX - EXPORT_PADDING_X;
    const dy = bounds.minY + offsetY - EXPORT_PADDING_Y;
    const w = bounds.width + EXPORT_PADDING_X * 2;
    const h = bounds.height + EXPORT_PADDING_Y * 2;

    const clone = svg.cloneNode(true);
    clone.setAttribute('viewBox',
      dx + " " + dy + " " + w + " " + h);
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);
    return clone;
  }

  render()
  {
    const graph = this.props.graph;
    const toolbar = this.props.toolbar;
    const workspace = this.props.workspace;
    const controller = this.props.controller;

    return <div className="panel-container" id="exporting" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>Exporting</h1>
      </div>
      <div className="panel-content">
        {/*JSON*/}
        <IconButton className="export-button" id="export-json" title="Save as JSON"
          onClick={()=>Downloader.downloadText(toolbar.getMachineName() + '.json', JSON.stringify(graph.toJSON()))}>
          <JSONIcon/>
          <label>Save as Flap.js Machine</label>
        </IconButton>
        {/*PNG*/}
        <IconButton className="export-button" id="export-png" title="Export as PNG"
          onClick={() => {
            const original = workspace.ref;
            const width = original.viewBox.baseVal.width;
            const height = original.viewBox.baseVal.height;
            const svg = this.prepareSVGForExport(original, width, height);
            Downloader.downloadSVG(toolbar.getMachineName(), 'png', svg, width, height);
          }}>
          <PNGIcon/>
          <label>Export as PNG</label>
        </IconButton>
        {/*JPG*/}
        <IconButton className="export-button" id="export-jpg" title="Export as JPG"
          onClick={() => {
            const boundingRect = graph.getBoundingRect();
            Downloader.downloadSVG(toolbar.getMachineName(), 'jpg', workspace.ref, boundingRect);
          }}>
          <JPGIcon/>
          <label>Export as JPG</label>
        </IconButton>
        {/*XML*/}
        <IconButton className="export-button" id="export-xml" title="Export as JFF"
          disabled="true">
          {/*TODO: Add JFLAP export functionality*/}
          <XMLIcon/>
          <label>Export to JFLAP</label>
        </IconButton>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default ExportingPanel;
