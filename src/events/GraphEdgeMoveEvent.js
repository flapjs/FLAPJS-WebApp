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
    this.edge.copyQuadraticsFrom(this.prevQuad);
  }

  //Override
  applyRedo()
  {
    this.edge.copyQuadraticsFrom(this.nextQuad);
  }
}

export default GraphEdgeMoveEvent;
