class AbstractGraphLabeler
{
  constructor() {}

  getDefaultNodeLabel()
  {
    return "";
  }

  getDefaultEdgeLabel()
  {
    return "";
  }

  getNodeLabelFormatter()
  {
    throw new Error("Node label formatting is not supported");
  }

  getEdgeLabelFormatter()
  {
    throw new Error("Edge label formatting is not supported");
  }
}

export default AbstractGraphLabeler;
