import Event from './Event.js';

class GraphEdgeDestinationEvent extends Event
{
  constructor(graph, edge, nextDestination, prevDestination, prevQuad)
  {
    super();

    this.graph = graph;
    this.edge = edge;

    this.nextDestination = nextDestination;
    this.prevDestination = prevDestination;

    const edgeQuad = edge.getQuadratic();
    this.nextQuad = { radians: edgeQuad.radians, length: edgeQuad.length };
    this.prevQuad = Object.assign({}, prevQuad);
  }

  //Override
  applyUndo()
  {
    let radians = this.prevQuad.radians;
    const length = this.prevQuad.length;

    this.edge.changeDestinationNode(this.prevDestination);

    //Flip them, since self loops are upside down
    if (this.edge.isSelfLoop()) radians = -radians;
    this.edge.setQuadratic(radians, length);
  }

  //Override
  applyRedo()
  {
    let radians = this.nextQuad.radians;
    const length = this.nextQuad.length;

    this.edge.changeDestinationNode(this.nextDestination);

    this.edge.setQuadratic(radians, length);
  }
}

export default GraphEdgeDestinationEvent;
