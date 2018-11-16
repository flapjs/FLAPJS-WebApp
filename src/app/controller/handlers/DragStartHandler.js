import Config from 'config.js';

import Node from 'graph/Node.js';
import Edge from 'graph/Edge.js';

class DragStartHandler
{
  constructor(inputController, graphController)
  {
    this.inputController = inputController;
    this.graphController = graphController;
  }

  onEvent(pointer)
  {
    const inputController = this.inputController;
    const graphController = this.graphController;
    const picker = inputController.getPicker();
    const x = pointer.x;
    const y = pointer.y;
    const target = picker.initialTarget;
    const targetType = picker.initialTargetType;

    const viewport = inputController.getViewport();

    //If is in move mode...
    if (inputController.isMoveMode())
    {
      //Make sure it is not in trash mode
      if (inputController.isTrashMode())
      {
        //inputController.setMoveMode(false, true);//Set to false

        graphController.emit("tryCreateWhileTrash");
        return false;
      }

      //Make sure it is not in new edge mode
      inputController.isNewEdge = false;

      //Makes sure that placeholders are not quadratics!
      if (targetType === 'edge' && target.isPlaceholder())
      {
        //inputController.setMoveMode(false, true);//Set to false

        //Ignore drag event...
        return false;
      }
      //Moving node (and selected nodes)
      else if (targetType === 'node')
      {
        //target MUST be an instance of Node...
        if (!(target instanceof Node))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Node.");

        //Ready to move node(s)...
        graphController.prevX = target.x;
        graphController.prevY = target.y;
        return true;
      }
      //Moving edge center point
      else if (targetType === 'edge')
      {
        //target MUST be an instance of Edge...
        if (!(target instanceof Edge))
          throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

        //Makes sure that placeholders are not quadratics!
        if (target.isPlaceholder())
        {
          //inputController.setMoveMode(false, true);//Set to false
          return false;
        }

        //Save previous quadratics
        target.copyQuadraticsTo(graphController.prevQuad);
        //this.prevQuad.x = target.quad.x;
        //this.prevQuad.y = target.quad.y;

        //Ready to move the edge vertex to pointer...
        return true;
      }
      //Moving initial marker
      else if (targetType === 'initial')
      {
        inputController.ghostInitialMarker = pointer;

        //Ready to move the initial marker to another state...
        return true;
      }
      //Moving nothing
      else if (targetType === 'none')
      {
        //Reuse nodal prev pos for graph prev pos
        graphController.prevX = x;
        graphController.prevY = y;

        //Ready to move the graph to pointer...
        return true;
      }
    }
    //If is NOT in move mode...
    else
    {
      //If action dragged a node...
      if (targetType === 'node')
      {
        if (!inputController.isTrashMode())
        {
          const edge = graphController.graph.newEdge(target, pointer, Config.STR_TRANSITION_DEFAULT_LABEL);

          //Redirect pointer to refer to the edge as the new target
          picker.setInitialTarget(edge, "endpoint");
          inputController.isNewEdge = true;

          //Reset previous quad values for new proxy edge
          edge.copyQuadraticsTo(graphController.prevQuad);
          //this.prevQuad.x = 0;
          //this.prevQuad.y = 0;

          //Ready to move proxy edge to pointer...
          //inputController.setMoveMode(true, true);
          return true;
        }
        else
        {
          graphController.emit("tryCreateWhileTrash");
          return false;
        }
      }
      else if (targetType == 'edge')
      {
        //Do nothing.
        return false;
      }
      //If action dragged nothing...
      else if (targetType === 'none')
      {
        //Begin selection box...
        picker.beginSelection(x, y);
        return true;
      }
    }

    //In either moving or not... moving endpoints
    if (targetType === 'endpoint')
    {
      //target MUST be an instance of Edge...
      if (!(target instanceof Edge))
        throw new Error("Invalid target " + target + " for type \'" + targetType + "\'. Must be an instance of Edge.");

      target.copyQuadraticsTo(graphController.prevQuad);
      graphController.prevEdgeTo = target.to;
      inputController.isNewEdge = inputController.isMoveMode() ? false : true;

      //Ready to move the edge endpoint to pointer...
      return true;
    }

    //All input should be handled
    //throw new Error("Unknown target type \'" + targetType + "\'.");

    return false;
  }
}

export default DragStartHandler;
