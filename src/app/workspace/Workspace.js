import React from 'react';

import './Workspace.css';

import * as Config from 'config.js';
import GraphRenderer from './renderer/GraphRenderer.js';
import GraphInputController from './controller/input/GraphInputController.js';

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

  render()
  {
    const controller = this.state.controller;
    return <svg id="workspace-content" ref={ref => this.viewport = ref}
      viewBox="-150 -150 300 300"
      xmlns="http://www.w3.org/2000/svg">
      <GraphRenderer graph={this.props.graph}/>
      { controller != null &&
        <g>
          //Selected Elements
          { controller.hasSelection() &&
            controller.getSelection().map((e, i) =>
              <Select key={i} target={e} type="node" />) }

          //SelectionBox
          { controller.isSelecting &&
            <SelectionBox selectBox={controller.selectBox} /> }

          //Hover Element
          { controller.hoverTarget != null &&
            !controller.selectBox.targets.includes(controller.hoverTarget) &&
            <Select key={-1} target={controller.hoverTarget} type={controller.hoverType} /> }

          //TrashArea
          <TrashArea trashArea={controller.trashArea} />
        </g> }
    </svg>;
  }
}

function SelectionBox(props)
{
  const selectBox = props.selectBox;
  const dx = selectBox.mx - selectBox.x;
  const dy = selectBox.my - selectBox.y;
  /*
    //Shadows
    ctx.shadowColor = Config.SELECTION_BOX_SHADOW_COLOR;
    ctx.shadowBlur = Config.SELECTION_BOX_SHADOW_SIZE;
    ctx.shadowOffsetX = Config.SELECTION_BOX_SHADOW_OFFSETX;
    ctx.shadowOffsetY = Config.SELECTION_BOX_SHADOW_OFFSETY;
  */
  return <g>
    <rect
      x={dx < 0 ? selectBox.mx : selectBox.x} y={dy < 0 ? selectBox.my : selectBox.y}
      width={dx < 0 ? -dx : dx} height={dy < 0 ? -dy : dy}
      fill={Config.SELECTION_BOX_FILL_STYLE}
      stroke={Config.SELECTION_BOX_STROKE_STYLE} />
  </g>;
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
      x = target.x;
      y = target.y;
      r = Config.EDGE_RADIUS;
      break;
    case "endpoint":
      const endpoint = target.getEndPoint();
      x = endpoint[0];
      y = endpoint[1];
      r = Config.ENDPOINT_RADIUS;
      break;
    default:
      x = x;
      y = y;
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
