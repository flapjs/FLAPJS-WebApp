import Event from './Event.js';

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

export default GraphNodeDeleteAllEvent;
