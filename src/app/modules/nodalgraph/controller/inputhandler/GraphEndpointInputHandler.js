import GraphElementInputHandler from './GraphElementInputHandler.js';
import GraphNode from 'graph/elements/GraphNode.js';

class GraphEndpointInputHandler extends GraphElementInputHandler
{
  constructor()
  {
    super("endpoint");
  }

  //Override
  onAction(inputController, graphController, pointer, target)
  {
    if (inputController.isTrashMode())
    {
      //Delete a single edge
      graphController.deleteTargetEdge(target);
      return true;
    }
    return false;
  }

  //Override
  onDragStart(inputController, graphController, pointer, target)
  {
    const targetQuad = target.getQuadratic();
    graphController.prevQuad.radians = targetQuad.radians;
    graphController.prevQuad.length = targetQuad.length;
    graphController.prevEdgeTo = target.getEdgeTo();

    inputController.isNewEdge = false;

    //Ready to move the edge endpoint to pointer...
    return true;
  }

  //Override
  onDragMove(inputController, graphController, pointer, target)
  {
    graphController.moveEndpointTo(pointer, target, pointer.x, pointer.y);
    return true;
  }

  //Override
  onDragStop(inputController, graphController, pointer, target)
  {
    const graph = graphController.getGraph();
    const x = pointer.x;
    const y = pointer.y;

    //Delete it if withing trash area...
    if (inputController.isTrashMode())
    {
      graphController.deleteTargetEdge(target);
      return true;
    }
    //If hovering over a node...
    else if (target.getEdgeTo() instanceof GraphNode)
    {
      const result = graph.formatEdge(target);

      //If a different edge is the result of the target...
      if (result !== target)
      {
        //Allow the user to edit the merged labels
        graphController.openLabelEditor(result, result.getEdgeLabel());

        //Delete the merged label
        graph.deleteEdge(target);
        return true;
      }
      //Open label editor if a new edge...
      else
      {
        if (inputController.isNewEdge)
        {
          graphController.openLabelEditor(result, "", (target, value) => graphController.onGraphIntentFinishEdge(target));
        }
        else
        {
          graphController.openLabelEditor(target, target.getEdgeLabel());
        }
      }

      if (inputController.isNewEdge)
      {
        //Must be after openLabelEditor() to allow the function to check it...
        inputController.isNewEdge = false;

        //Emit event
        graphController.onGraphIntentCreateEdge(target);
      }
      else if (graphController.prevEdgeTo !== null)
      {
        //Emit event
        graphController.onGraphIntentChangeDestination(target, target.getEdgeTo(), graphController.prevEdgeTo, graphController.prevQuad);
      }

      return true;
    }
    //If hovering over anything else...
    else
    {
      //Destroy any edge that no longer have a destination
      if (inputController.shouldDestroyPointlessEdges)
      {
        if (!inputController.isNewEdge)
        {
          graphController.deleteTargetEdge(target);
        }
        else
        {
          graph.deleteEdge(target);
        }
        return true;
      }
      //Keep edges as placeholders (used in DFA's)
      else
      {
        target.changeDestinationNode(null);

        //Open label editor if default edge...
        if (target.getEdgeLabel().length <= 0)
        {
          graphController.openLabelEditor(target, target.getEdgeLabel());
        }
        return true;
      }
    }
  }
}

export default GraphEndpointInputHandler;
