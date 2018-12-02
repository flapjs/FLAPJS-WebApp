import Event from './Event.js';

class GraphEdgeMoveEvent extends Event
{
  constructor(graph, edge, nextQuad, prevQuad)
  {
    super();

    this.graph = graph;
    this.edge = edge;

    this.nextQuad = Object.assign({}, nextQuad);
    this.prevQuad = Object.assign({}, prevQuad);
  }

  //Override
  applyUndo()
  {
    this.edge.setQuadratic(this.prevQuad.radians, this.prevQuad.length);
  }

  //Override
  applyRedo()
  {
    this.edge.setQuadratic(this.nextQuad.radians, this.nextQuad.length);
  }
}

export default GraphEdgeMoveEvent;
