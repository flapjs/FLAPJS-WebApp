import React from 'react';
import './Workspace.css';

import Config from 'deprecated/config.js';

import Subtitle from './Subtitle.js';

const WORKSPACE_OFFSET_X = 0;
const WORKSPACE_OFFSET_Y = 0;
const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

const GRAPH_RENDER_LAYER = "graph";
const GRAPH_OVERLAY_RENDER_LAYER = "graphoverlay";

class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
  }

  getSVGForExport(width, height)
  {
    const svg = this.ref;
    if (!svg) return null;

    const currentModule = this.props.currentModule;
    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();

    const viewport = inputController.getInputAdapter().getViewportAdapter();
    const offsetX = viewport.getOffsetX();
    const offsetY = viewport.getOffsetY();
    const bounds = graphController.getGraph().getBoundingRect();
    const dx = bounds.minX + offsetX - EXPORT_PADDING_X;
    const dy = bounds.minY + offsetY - EXPORT_PADDING_Y;
    const w = bounds.width + EXPORT_PADDING_X * 2;
    const h = bounds.height + EXPORT_PADDING_Y * 2;
    const clone = svg.cloneNode(true);
    clone.setAttribute('viewBox', dx + " " + dy + " " + w + " " + h);
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);

    //Apply the workspace font (refer to Workspace.css)
    clone.setAttribute('font-size', "16px");
    clone.setAttribute('font-family', "monospace");
    clone.setAttribute('style', ".graph-ui {display: none;}");

    /*
    //TODO: Link the font family to svg
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    clone.appendChild(link);
    */

    //Remove unwanted ui elements from image
    const uiElements = clone.getElementsByClassName("graph-ui");
    while(uiElements.length > 0)
    {
      const e = uiElements[0];
      e.remove();//This will propagate changes to uiElements, so be careful
    }

    return clone;
  }

  render()
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const inputController = currentModule.getInputController();
    const machineController = currentModule.getMachineController();

    const GraphRenderer = currentModule.getRenderer(GRAPH_RENDER_LAYER);
    const GraphOverlayRenderer = currentModule.getRenderer(GRAPH_OVERLAY_RENDER_LAYER);

    const graph = graphController.getGraph();
    const viewport = inputController.getInputAdapter().getViewportAdapter();

    let size = Config.DEFAULT_GRAPH_SIZE * Math.max(Number.MIN_VALUE, viewport.getScale());
    const halfSize = size / 2;

    //Must not be a block content (must inline)
    return <svg id="workspace-content" ref={ref=>this.ref=ref}
      viewBox={(-halfSize + WORKSPACE_OFFSET_X) + " "
        + (-halfSize + WORKSPACE_OFFSET_Y) + " "
        + size + " " + size}
      xmlns="http://www.w3.org/2000/svg">

      {/* Graph subtitle */}
      <Subtitle visible={graph.isEmpty()}/>

      {/* Graph elements */}
      <g id="workspace-content-elements" transform={"translate("
        + viewport.getOffsetX() + " "
        + viewport.getOffsetY() + ")"}>

        {/* Graph origin crosshair */}
        <g className="graph-ui">
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#E6E6E6"/>
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#E6E6E6"/>
        </g>

        {/* Graph objects */}
        { GraphRenderer &&
          <GraphRenderer {...this.props} parent={this}/> }

        {/* Graph overlays */}
        { GraphOverlayRenderer &&
          <GraphOverlayRenderer {...this.props} parent={this}/> }
      </g>
    </svg>;
  }
}

export default Workspace;
