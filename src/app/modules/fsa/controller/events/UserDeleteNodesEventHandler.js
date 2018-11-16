import EventHandler from './EventHandler.js';

import NodalGraph from 'graph/NodalGraph.js';
import NodalGraphParser from 'graph/NodalGraphParser.js';

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
      targets.push(target.id);
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

/******************************************************************************

class GraphNodeDeleteAllEvent extends Event
{
  constructor(graph, nodes, selectedNode, prevX, prevY)
  {
    super();

    this.graph = graph;
    this.nodes = nodes;

    //We could set the node position here, but then it will flash at the old position...
    this.dx = selectedNode.x - prevX;
    this.dy = selectedNode.y - prevY;

    this.outEdges = [];
    this.inEdges = [];
    this.closedEdges = [];

    //Get all connected edges
    let from = false;
    let to = false;
    for(const edge of this.graph.edges)
    {
      from = this.nodes.includes(edge.from);
      to = this.nodes.includes(edge.to);
      if (from)
      {
        if (!to)
        {
          this.outEdges.push(edge);
        }
        else
        {
          //Save the 'to' data
          this.closedEdges.push({
            edge: edge,
            node: edge.to
          });
        }
      }
      else if (to)
      {
        //Save the 'to' data
        this.inEdges.push({
          edge: edge,
          node: edge.to
        });
      }
    }
  }

  //Override
  applyUndo()
  {
    //Add back the nodes
    for(const node of this.nodes)
    {
      node.x -= this.dx;
      node.y -= this.dy;
      this.graph.nodes.push(node);
    }

    //Closed edges
    for(const e of this.closedEdges)
    {
      //This is because when deleting nodes, it also deletes the 'to' data of each edge
      const edge = e.edge;
      const node = e.node;
      edge.to = node;

      //Add back to the graph
      this.graph.edges.push(edge);
    }

    //Out edges
    for(const edge of this.outEdges)
    {
      this.graph.edges.push(edge);
    }

    //In edges
    for(const e of this.inEdges)
    {
      const edge = e.edge;
      const node = e.node;
      edge.to = node;
    }
  }

  //Override
  applyRedo()
  {
    let index = 0;

    //Closed edges
    for(const e of this.closedEdges)
    {
      const edge = e.edge;
      const node = e.node;

      index = this.graph.edges.indexOf(edge);
      if (index < 0) throw new Error("Unable to find target in graph");

      this.graph.edges.splice(index, 1);
    }

    //Out edges
    for(const edge of this.outEdges)
    {
      index = this.graph.edges.indexOf(edge);
      if (index < 0) throw new Error("Unable to find target in graph");

      this.graph.edges.splice(index, 1);
    }

    //In edges
    for(const e of this.inEdges)
    {
      const edge = e.edge;
      edge.to = null;
      edge.makePlaceholder();
    }

    //Delete all nodes
    for(const node of this.nodes)
    {
      index = this.graph.nodes.indexOf(node);
      if (index < 0) throw new Error("Unable to find target in graph");

      //Delete node
      node.x += this.dx;
      node.y += this.dy;
      this.graph.nodes.splice(index, 1);
    }
  }
}

******************************************************************************/




/*****************************************************************************

class GraphNodeDeleteEvent extends Event
{
  constructor(graph, node, prevX, prevY)
  {
    super();

    this.graph = graph;
    this.node = node;

    //We could set the node position here, but then it will flash at the old position...
    this.prevX = prevX;
    this.prevY = prevY;

    this.outEdges = [];
    this.inEdges = [];
    this.selfEdges = [];

    //Get all connected edges
    for(const edge of this.graph.edges)
    {
      if (edge.from === this.node)
      {
        if (edge.from !== edge.to)
        {
          this.outEdges.push(edge);
        }
        else
        {
          this.selfEdges.push(edge);
        }
      }
      else if (edge.to === this.node)
      {
        //Save quad information for placeholders
        this.inEdges.push(edge);
      }
    }
  }

  //Override
  applyUndo()
  {
    //Self edges
    for(const edge of this.selfEdges)
    {
      this.graph.edges.push(edge);
    }

    //Out edges
    for(const edge of this.outEdges)
    {
      this.graph.edges.push(edge);
    }

    //In edges
    for(const edge of this.inEdges)
    {
      edge.to = this.node;
    }

    //Add back the node
    this.node.x = this.prevX;
    this.node.y = this.prevY;
    this.graph.nodes.push(this.node);
  }

  //Override
  applyRedo()
  {
    let index = 0;

    //Self edges
    for(const edge of this.selfEdges)
    {
      index = this.graph.edges.indexOf(edge);
      if (index < 0) throw new Error("Unable to find target in graph");

      this.graph.edges.splice(index, 1);
    }

    //Out edges
    for(const edge of this.outEdges)
    {
      index = this.graph.edges.indexOf(edge);
      if (index < 0) throw new Error("Unable to find target in graph");

      this.graph.edges.splice(index, 1);
    }

    //In edges
    for(const edge of this.inEdges)
    {
      edge.makePlaceholder();
    }

    index = this.graph.nodes.indexOf(this.node);
    if (index < 0) throw new Error("Unable to find target in graph");

    //Delete node
    this.graph.nodes.splice(index, 1);
  }
}

******************************************************************************/
