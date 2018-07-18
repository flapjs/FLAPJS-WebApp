import Event from './Event.js';

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
      edge.to = null;
      edge.makePlaceholder();
    }

    index = this.graph.nodes.indexOf(this.node);
    if (index < 0) throw new Error("Unable to find target in graph");

    //Delete node
    this.graph.nodes.splice(index, 1);
  }
}

export default GraphNodeDeleteEvent;
