import React from 'react';
import '../Panel.css';
import './ExportingPanel.css';

import Downloader from 'util/Downloader.js';
import * as FlapSaver from 'util/FlapSaver.js';
import NodalGraphParser from 'modules/fsa/graph/NodalGraphParser.js';

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

    this.container = null;

    this.onExportXML = this.onExportXML.bind(this);
    this.onExportJSON = this.onExportJSON.bind(this);
    this.onExportPNG = this.onExportPNG.bind(this);
    this.onExportJPG = this.onExportJPG.bind(this);
  }

  onExportJSON(e)
  {
    const jsonString = JSON.stringify(FlapSaver.saveToJSON(this.props.graphController, this.props.machineController));
    const machineName = this.props.machineController.getMachineName();
    Downloader.downloadText(machineName + '.json', jsonString);
  }

  onExportXML(e)
  {
    const machineName = this.props.machineController.getMachineName();
    const graph = this.props.graphController.getGraph();

    const xmlString = new XMLSerializer().serializeToString(NodalGraphParser.toXML(graph));
    Downloader.downloadText(machineName + '.jff', xmlString);
  }

  onExportPNG(e)
  {
    const machineName = this.props.machineController.getMachineName();

    const app = this.props.app;
    const workspace = app.workspace;
    const workspaceDim = workspace.ref.viewBox.baseVal;
    const width = workspaceDim.width;
    const height = workspaceDim.height;
    const svg = workspace.getSVGForExport(width, height);

    Downloader.downloadSVG(machineName, 'png', svg, width, height);
  }

  onExportJPG(e)
  {
    const machineName = this.props.machineController.getMachineName();

    const app = this.props.app;
    const workspace = app.workspace;
    const workspaceDim = workspace.ref.viewBox.baseVal;
    const width = workspaceDim.width;
    const height = workspaceDim.height;
    const svg = workspace.getSVGForExport(width, height);

    Downloader.downloadSVG(machineName, 'jpg', svg, width, height);
  }

  render()
  {
    return <div className="panel-container" id="exporting" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title">
        <h1>{I18N.toString("component.exporting.title")}</h1>
      </div>
      <div className="panel-content">
        {/*JSON*/}
        <IconButton className="export-button" id="export-json"
          title={I18N.toString("file.export.machine.hint")}
          onClick={this.onExportJSON}>
          <JSONIcon/>
          <label>{I18N.toString("file.export.machine")}</label>
        </IconButton>
        {/*PNG*/}
        <IconButton className="export-button" id="export-png"
          title={I18N.toString("file.export.png.hint")}
          onClick={this.onExportPNG}>
          <PNGIcon/>
          <label>{I18N.toString("file.export.png")}</label>
        </IconButton>
        {/*JPG*/}
        <IconButton className="export-button" id="export-jpg"
          title={I18N.toString("file.export.jpg.hint")}
          onClick={this.onExportJPG}>
          <JPGIcon/>
          <label>{I18N.toString("file.export.jpg")}</label>
        </IconButton>
        {/*XML*/}
        <IconButton className="export-button" id="export-xml"
          title={I18N.toString("file.export.jff.hint")}
          onClick={this.onExportXML}>
          <XMLIcon/>
          <label>{I18N.toString("file.export.jff")}</label>
        </IconButton>
        <hr/>
        {/*Save to E-mail*/}
        <div className="export-email">
        </div>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}
ExportingPanel.UNLOCALIZED_NAME = "component.exporting.title";

export default ExportingPanel;
