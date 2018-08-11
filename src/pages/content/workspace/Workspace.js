import React from 'react';
import './Workspace.css';

import Config from 'config.js';

import Subtitle from './Subtitle.js';

import NodeRenderer from './renderer/NodeRenderer.js';
import EdgeRenderer from './renderer/EdgeRenderer.js';
import SelectionBoxRenderer from './renderer/SelectionBoxRenderer.js';
import InitialMarkerRenderer from './renderer/InitialMarkerRenderer.js';
import HighlightRenderer from './renderer/HighlightRenderer.js';

const WORKSPACE_OFFSET_X = 15;
const WORKSPACE_OFFSET_Y = 0;

class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = React.createRef();
  }

  componentWillUpdate()
  {
    //Update input controller (usually mouse position for hover info)
    //this.props.controller.pointer.updateTarget();
  }

  render()
  {
    const graph = this.props.graph;
    const controller = this.props.controller;
    const pointer = controller.pointer;
    const machineBuilder = this.props.machineBuilder;

    let size = Config.DEFAULT_GRAPH_SIZE * Math.max(Number.MIN_VALUE, pointer.scale);
    const halfSize = size / 2;

    //Must not be a block content (must inline)
    return <svg id="workspace-content" ref={ref=>this.ref=ref}
      viewBox={(-halfSize + WORKSPACE_OFFSET_X) + " " + (-halfSize + WORKSPACE_OFFSET_Y) + " " + size + " " + size}
      xmlns="http://www.w3.org/2000/svg">

      <Subtitle visible={graph.isEmpty()}/>

      <filter id="error-highlight" height="300%" width="300%" x="-75%" y="-75%">
        <feColorMatrix type="matrix"
          result="color"
          values={
            "1 0 0 0 1 " +
            "0 0 0 0 0 " +
            "0 0 0 0 0 " +
            "0 0 0 1 0"
          }/>
        <feGaussianBlur in="color" stdDeviation="1" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <g transform={"translate(" + controller.pointer.offsetX + " " + controller.pointer.offsetY + ")"}>

        <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(0,0,0,0.04)"/>
        <line x1="-5" y1="0" x2="5" y2="0" stroke="rgba(0,0,0,0.04)"/>

        //Graph objects
        <g>
          //Nodes
          { graph.nodes.map((e, i) =>
            <NodeRenderer key={i} node={e}/>) }

          //Edges
          { graph.edges.map((e, i) =>
            <EdgeRenderer key={i} edge={e}
              start={e.getStartPoint()}
              end={e.getEndPoint()}
              center={e.getCenterPoint()}
              label={e.label}/>) }
        </g>

        //Graph guis
        <g>
          //Initial marker (and ghost)
          { graph.getStartNode() && (controller.ghostInitialMarker == null ?
            <InitialMarkerRenderer node={graph.getStartNode()}/> :
            <InitialMarkerRenderer node={controller.ghostInitialMarker}/>) }

          //Selected Elements
          { controller.selector.hasSelection() &&
            controller.selector.getSelection().map((e, i) =>
              <HighlightRenderer key={e.label} target={e} type="node" color="gray"/>) }

          //SelectionBox
          <SelectionBoxRenderer src={controller.selector}/>

          { machineBuilder.machineErrorChecker.errorNodes.map((e, i) =>
            <HighlightRenderer key={e.label} target={e} type="node" color="red" offset="6"/>) }

          //Hover Element
          { /*controller.pointer.target &&
            !controller.selector.isTargetSelected(controller.pointer.target) &&
            <Select target={controller.pointer.target} type={controller.pointer.targetType}/>*/ }

          </g>
        </g>
    </svg>;
  }
}

export default Workspace;
