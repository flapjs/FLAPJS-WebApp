import React from 'react';

import './Workspace.css';

import * as Config from 'config.js';

import NodeRenderer from './renderer/NodeRenderer.js';
import EdgeRenderer from './renderer/EdgeRenderer.js';
import SelectionBoxRenderer from './renderer/SelectionBoxRenderer.js';
import InitialMarkerRenderer from './renderer/InitialMarkerRenderer.js';
import BorderRenderer from './renderer/BorderRenderer.js';

class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);
    this.viewpowrt = React.createRef();
  }

  componentDidMount()
  {
    //Initialize the controller to graph components
    this.props.controller.initialize(this.viewport);
  }

  componentDidUpdate()
  {
    //Update input controller (usually mouse position for hover info)
    this.props.controller.onUpdate();
  }

  render()
  {
    const graph = this.props.graph;
    const controller = this.props.controller;

    //Must not be a block content (must inline)
    return <svg id="workspace-content" ref={ref => this.viewport = ref}
      viewBox="-150 -150 300 300"
      xmlns="http://www.w3.org/2000/svg">
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
      { controller != null &&
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
          { controller.pointer.target &&
            !controller.selector.isTargetSelected(controller.pointer.target) &&
            <Select target={controller.pointer.target} type={controller.pointer.targetType}/> }

          //Border Element
          <BorderRenderer mode={
            controller.pointer.isTrashMode() ? 2 :
            controller.pointer.isMoveMode() ? 1 : 0}/>

        </g> }
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
      x = target.x;
      y = target.y;
      r = Config.NODE_RADIUS;
      break;
    case "edge":
      const center = target.getCenterPoint();
      x = center.x;
      y = center.y;
      r = Config.EDGE_RADIUS;
      break;
    case "endpoint":
      const endpoint = target.getEndPoint();
      x = endpoint.x;
      y = endpoint.y;
      r = Config.ENDPOINT_RADIUS;
      break;
    case "initial":
      x = target.x - Config.NODE_RADIUS;
      y = target.y;
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

  /*
    const angle = hoverAngle;
    ctx.strokeStyle = Config.HOVER_STROKE_STYLE;
    ctx.lineWidth = Config.HOVER_LINE_WIDTH;
    ctx.beginPath();
    ctx.setLineDash(Config.HOVER_LINE_DASH);
    ctx.arc(x, y, r + Config.HOVER_RADIUS_OFFSET, 0 + angle, Config.PI2 + angle);
    ctx.stroke();
  */
}

export default Workspace;
