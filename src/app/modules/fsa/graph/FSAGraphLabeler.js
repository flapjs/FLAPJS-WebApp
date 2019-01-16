import AbstractGraphLabeler from 'graph/AbstractGraphLabeler.js';

class FSAGraphLabeler extends AbstractGraphLabeler
{
  constructor()
  {
    super();
  }

  //Override
  getDefaultNodeLabel()
  {
    return "";
  }

  //Override
  getDefaultEdgeLabel()
  {
    return "";
  }

  //Override
  getEdgeLabelFormatter()
  {
    throw new Error("Edge label formatting is not supported");
  }
}

export default FSAGraphLabeler;
