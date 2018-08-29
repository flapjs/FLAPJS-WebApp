import React from 'react';
import './Workspace.css';

import Config from 'config.js';

import Subtitle from './Subtitle.js';

import NodeRenderer from './renderer/NodeRenderer.js';
import EdgeRenderer from './renderer/EdgeRenderer.js';
import SelectionBoxRenderer from './renderer/SelectionBoxRenderer.js';
import InitialMarkerRenderer from './renderer/InitialMarkerRenderer.js';
import HighlightRenderer from './renderer/HighlightRenderer.js';

const WORKSPACE_OFFSET_X = 0;
const WORKSPACE_OFFSET_Y = 0;
const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = React.createRef();
  }

  getSVGForExport(width, height)
  {
    const svg = this.ref;
    const pointer = this.props.inputController.getPointer();
    const offsetX = pointer.offsetX;
    const offsetY = pointer.offsetY;
    const bounds = this.props.graphController.getGraph().getBoundingRect();

    const dx = bounds.minX + offsetX - EXPORT_PADDING_X;
    const dy = bounds.minY + offsetY - EXPORT_PADDING_Y;
    const w = bounds.width + EXPORT_PADDING_X * 2;
    const h = bounds.height + EXPORT_PADDING_Y * 2;
    const clone = svg.cloneNode(true);
    clone.setAttribute('viewBox',
      dx + " " + dy + " " + w + " " + h);
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);

    //Apply the workspace font (refer to Workspace.css)
    clone.setAttribute('font-size', "16px");
    clone.setAttribute('font-family', "monospace");

    /*
    //TODO: Link the font family to svg
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    clone.appendChild(link);
    */

    //Remove unwanted ui elements from image
    const uiElements = clone.getElementsByClassName("graph-ui");
    for(const e of uiElements)
    {
      e.remove();
    }

    return clone;
  }

  render()
  {
    const graphController = this.props.graphController;
    const inputController = this.props.inputController;
    const machineController = this.props.machineController;
    const tester = this.props.tester;

    const graph = graphController.getGraph();
    const machineBuilder = machineController.getMachineBuilder();
    const pointer = inputController.getPointer();

    let size = Config.DEFAULT_GRAPH_SIZE * Math.max(Number.MIN_VALUE, pointer.scale);
    const halfSize = size / 2;

    //Must not be a block content (must inline)
    return <svg id="workspace-content" ref={ref=>this.ref=ref}
      viewBox={(-halfSize + WORKSPACE_OFFSET_X) + " " + (-halfSize + WORKSPACE_OFFSET_Y) + " " + size + " " + size}
      xmlns="http://www.w3.org/2000/svg">

      {/* Graph subtitle */}
      <Subtitle visible={graph.isEmpty()}/>

      {/* Graph elements */}
      <g id="workspace-content-elements" transform={
        "translate(" +
        pointer.offsetX + " " +
        pointer.offsetY + ")"}>

        {/* Graph origin crosshair */}
        <line className="graph-ui" x1="0" y1="-5" x2="0" y2="5" stroke="rgba(0,0,0,0.04)"/>
        <line className="graph-ui" x1="-5" y1="0" x2="5" y2="0" stroke="rgba(0,0,0,0.04)"/>

        {/* Graph objects */}
        <g>
          {/* Nodes */}
          {graph.nodes.map((e, i) => <NodeRenderer key={e.id} node={e}/>)}

          {/* Edges */}
          {graph.edges.map((e, i) => <EdgeRenderer key={e.id} edge={e}/>)}
        </g>

        {/* Graph GUIs */}
        <g>
          {/* Initial marker and ghost */}
          { graph.getStartNode() && (graphController.ghostInitialMarker == null ?
            <InitialMarkerRenderer node={graph.getStartNode()}/> :
            <InitialMarkerRenderer node={graphController.ghostInitialMarker}/>) }

          {/* Selected elements */}
          { graphController.selector.hasSelection() &&
            graphController.selector.getSelection().map((e, i) =>
              <HighlightRenderer key={e.id} className="highlight-select" target={e} type="node"/>) }

          {/* Selection box */}
          <SelectionBoxRenderer src={graphController.selector}/>

          {/* Node warning targets */}
          { machineBuilder.machineErrorChecker.warningNodes.map((e, i) =>
            <HighlightRenderer key={e.id} className="highlight-warning graph-gui" target={e} type="node" offset="6"/>) }

          {/* Edge warning targets */}
          { machineBuilder.machineErrorChecker.warningEdges.map((e, i) =>
            <HighlightRenderer key={e.id} className="highlight-warning graph-gui" target={e} type="edge" offset="6"/>) }

          {/* Node error targets */}
          { machineBuilder.machineErrorChecker.errorNodes.map((e, i) =>
            <HighlightRenderer key={e.id} className="highlight-error graph-gui" target={e} type="node" offset="6"/>) }

          {/* Edge error targets */}
          { machineBuilder.machineErrorChecker.errorEdges.map((e, i) =>
            <HighlightRenderer key={e.id} className="highlight-error graph-gui" target={e} type="edge" offset="6"/>) }


          {/* Node test targets */}
          { tester.testMode.targets.map((e, i) =>
            <HighlightRenderer key={e.id} className="highlight-test graph-gui" target={e} type="node" offset="6"/>) }

          {/* Hover markers */}
          { pointer.target &&
            !graphController.selector.isTargetSelected(pointer.target) &&
            <HighlightRenderer className="highlight-select" target={pointer.target} type={pointer.targetType}/> }

        </g>
      </g>
    </svg>;
  }
}

export default Workspace;
