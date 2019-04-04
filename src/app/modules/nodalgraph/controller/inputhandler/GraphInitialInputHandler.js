import GraphElementInputHandler from './GraphElementInputHandler.js';
import GraphNode from 'graph/GraphNode.js';

class GraphInitialInputHandler extends GraphElementInputHandler
{
  constructor()
  {
    super("initial");

    //Used to change render to follow pointer when moving initial marker
    this.ghostInitialMarker = null;
  }

  //Override
  onDragStart(inputController, graphController, pointer, target)
  {
    //Ready to move the initial marker to another state...
    this.ghostInitialMarker = pointer;
    return true;
  }

  //Override
  onDragMove(inputController, graphController, pointer, target)
  {
    const picker = inputController.getPicker();
    const graph = graphController.getGraph();
    const x = pointer.x;
    const y = pointer.y;
    //Move initial marker to node or pointer
    const dst = picker.getNodeAt(graph, x, y) || pointer;
    this.ghostInitialMarker = dst;
    return true;
  }

  //Override
  onDragStop(inputController, graphController, pointer, target)
  {
    const graph = graphController.getGraph();

    //If valid initial object to mark...
    if (this.ghostInitialMarker instanceof GraphNode)
    {
      const prevInitial = graph.getStartNode();

      //Set the new object as the initial node
      graph.setStartNode(this.ghostInitialMarker);
      graphController.applyAutoRename();

      //Emit event
      graphController.onGraphIntentChangeInitial(this.ghostInitialMarker, prevInitial);
      //graphController.emit("nodeInitial", graph, this.ghostInitialMarker, prevInitial);
    }

    //Reset ghost initial marker
    this.ghostInitialMarker = null;
    return true;
  }
}

export default GraphInitialInputHandler;
