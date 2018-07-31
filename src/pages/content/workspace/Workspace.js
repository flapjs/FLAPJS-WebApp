import React from 'react';

import './Workspace.css';

import * as Config from 'config.js';

import NodeRenderer from './renderer/NodeRenderer.js';
import EdgeRenderer from './renderer/EdgeRenderer.js';
import SelectionBoxRenderer from './renderer/SelectionBoxRenderer.js';
import InitialMarkerRenderer from './renderer/InitialMarkerRenderer.js';

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

    //Must not be a block content (must inline)
    return <svg id="workspace-content" ref={ref=>this.ref=ref}
      viewBox="-150 -150 300 300"
      xmlns="http://www.w3.org/2000/svg">

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

      <g transform={
        "translate(" + controller.pointer.offsetX + " " + controller.pointer.offsetY + ")"}>

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
              <Select key={i} target={e} type="node"/>) }

          //SelectionBox
          <SelectionBoxRenderer src={controller.selector}/>

          //Hover Element
          { /*controller.pointer.target &&
            !controller.selector.isTargetSelected(controller.pointer.target) &&
            <Select target={controller.pointer.target} type={controller.pointer.targetType}/>*/ }

          </g>
        </g>
    </svg>;
  }
}

function Select(props)
{
  const target = props.target;
  const type = props.type;

  let x = 0;
  let y = 0;
  let r = Config.CURSOR_RADIUS;
  switch(type)
  {
    case "node":
      x = target.x || 0;
      y = target.y || 0;
      r = Config.NODE_RADIUS;
      break;
    case "edge":
      const center = target.getCenterPoint();
      x = center.x || 0;
      y = center.y || 0;
      r = Config.EDGE_RADIUS;
      break;
    case "endpoint":
      const endpoint = target.getEndPoint();
      x = endpoint.x || 0;
      y = endpoint.y || 0;
      r = Config.ENDPOINT_RADIUS;
      break;
    case "initial":
      x = target.x - Config.NODE_RADIUS || 0;
      y = target.y || 0;
      r = Config.CURSOR_RADIUS;
      break;
  }

  return <g>
    <circle
      cx={x}
      cy={y}
      r={r + Config.HOVER_RADIUS_OFFSET}
      strokeDasharray={Config.HOVER_LINE_DASH}
      strokeWidth={Config.HOVER_LINE_WIDTH}
      stroke={Config.HOVER_STROKE_STYLE}
      fill="none" />
  </g>;
}

export default Workspace;
