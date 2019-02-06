import React from 'react';
import Style from './WorkspaceView.css';

const DEFAULT_WORKSPACE_SIZE = 300;
const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

class WorkspaceView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.ref = null;
  }

  getSVGForExport(width, height, currentModule)
  {
    const svg = this.ref;
    if (!svg) return null;

    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();

    const viewport = inputController.getInputAdapter().getViewport();
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

  //Override
  render()
  {
    const viewport = this.props.viewport;
    const offsetX = viewport.getOffsetX();
    const offsetY = viewport.getOffsetY();
    const viewSize = DEFAULT_WORKSPACE_SIZE * Math.max(Number.MIN_VALUE, viewport.getScale());
    const halfViewSize = viewSize / 2;
    return (
      <svg ref={ref=>this.ref=ref} id={this.props.id}
        className={"workspace-container" +
          " " + this.props.className}
        style={this.props.style}
        viewBox={(-halfViewSize) +
          " " + (-halfViewSize) +
          " " + viewSize +
          " " + viewSize}
        xmlns="http://www.w3.org/2000/svg">
        <g className="workspace-content" transform={"translate(" + offsetX + " " + offsetY + ")"}>
          {this.props.children}
        </g>
      </svg>
    );
  }
}

export default WorkspaceView;
