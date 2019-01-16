class AbstractGraphLabeler
{
  constructor()
  {
    this._graphController = null;
  }

  setGraphController(graphController)
  {
    this._graphController = graphController;
    return this;
  }

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

  getGraphController()
  {
    return this._graphController;
  }
}

export default AbstractGraphLabeler;
