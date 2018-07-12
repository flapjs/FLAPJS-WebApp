import React from 'react';

import './Workspace.css';

import * as Config from 'config.js';
import GraphRenderer from './renderer/GraphRenderer.js';
import SelectionBoxRenderer from './renderer/SelectionBoxRenderer.js';
import InitialMarkerRenderer from './renderer/InitialMarkerRenderer.js';

import GraphInputController from './controller/GraphInputController.js';

let hoverAngle = 0;
class Workspace extends React.Component
{
  constructor(props)
  {
    super(props);
    this.viewpowrt = React.createRef();
    this.state = {
      controller: null
    };
  }

  componentDidMount()
  {
    this.setState((prev, props) => {
      const controller = new GraphInputController(props.graph);
      controller.initialize(this.viewport);
      return {controller: controller};
    });
  }

  componentDidUpdate()
  {
    //TODO: Not used to animate hovering circles...
    hoverAngle = (hoverAngle + Config.HOVER_ANGLE_SPEED) % Config.PI2;
    this.state.controller.pointer.updateTarget();
  }

  render()
  {
    const graph = this.props.graph;
    const controller = this.state.controller;

    return <svg id="workspace-content" ref={ref => this.viewport = ref}
      viewBox="-150 -150 300 300"
      xmlns="http://www.w3.org/2000/svg">
      <GraphRenderer graph={this.props.graph}/>

      { controller != null &&
        <g>
          //Initial marker (and ghost)
          { graph.getStartNode() != null &&
            controller.ghostInitialMarker == null ?
            <InitialMarkerRenderer node={graph.getStartNode()}/> :
            <InitialMarkerRenderer node={controller.ghostInitialMarker}/> }

          //Selected Elements
          { controller.selector.hasSelection() &&
            controller.selector.getSelection().map((e, i) =>
              <Select key={i} target={e} type="node" />) }

          //SelectionBox
          <SelectionBoxRenderer src={controller.selector}/>

          //Hover Element
          { controller.pointer.target &&
            !controller.selector.targets.includes(controller.pointer.target) &&
            <Select target={controller.pointer.target} type={controller.pointer.targetType}/> }

          //TrashArea
          <TrashArea trashArea={controller.trashArea} />
        </g> }
    </svg>;
  }
}

function Select(props)
{
  const target = props.target;
  const type = props.type;
  const angle = hoverAngle;

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

function TrashArea(props)
{
  const trashArea = props.trashArea;
  /*
    //Shadows
    ctx.shadowColor = Config.TRASH_AREA_SHADOW_COLOR;
    ctx.shadowBlur = Config.TRASH_AREA_SHADOW_SIZE;
    ctx.shadowOffsetX = Config.TRASH_AREA_SHADOW_OFFSETX;
    ctx.shadowOffsetY = Config.TRASH_AREA_SHADOW_OFFSETY;
  */
  return <g>
    <rect
      x={trashArea.x} y={trashArea.y}
      width={trashArea.width} height={trashArea.height}
      fill={Config.TRASH_AREA_FILL_STYLE}
      stroke={Config.TRASH_AREA_STROKE_STYLE} />
  </g>;
}

export default Workspace;
