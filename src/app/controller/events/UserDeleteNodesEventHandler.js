import EventHandler from './EventHandler.js';

import NodalGraph from 'modules/fsa/graph/NodalGraph.js';
import NodalGraphParser from 'modules/fsa/graph/NodalGraphParser.js';

class UserDeleteNodesEventHandler extends EventHandler
{
  constructor(eventLogger, graphController)
  {
    super(eventLogger, graphController, "userPreDeleteNodes", "userPostDeleteNodes");
  }

  //Override
  captureEvent(graph, node, targetNodes, prevX, prevY)
  {
    const targets = [];
    for(const target of targetNodes)
    {
      targets.push(target.getGraphElementID());
    }
    const dx = node.x - prevX;
    const dy = node.y - prevY;

    return {
      graphData: NodalGraphParser.toJSON(graph),
      targets: targets,
      dx: dx,
      dy: dy
    };
  }

  //Override
  capturePostEvent(graph, node, targetNodes, prevX, prevY)
  {
    return {
      graphData: NodalGraphParser.toJSON(graph)
    };
  }

  //Override - this = event
  applyUndo(e)
  {
    const graph = this.controller.getGraph();
    NodalGraphParser.parseJSON(e.eventData.graphData, this.controller.getGraph());
    for(const targetID of e.eventData.targets)
    {
      const nodeIndex = graph.getNodeIndexByID(targetID);
      if (nodeIndex < 0) throw new Error("Unable to find target in graph");
      graph.nodes[nodeIndex].x -= e.eventData.dx;
      graph.nodes[nodeIndex].y -= e.eventData.dy;
    }
  }

  //Override - this = event
  applyRedo(e)
  {
    NodalGraphParser.parseJSON(e.postData.graphData, this.controller.getGraph());
  }
}
export default UserDeleteNodesEventHandler;
