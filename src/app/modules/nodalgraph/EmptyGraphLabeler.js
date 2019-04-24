import AbstractGraphLabeler from 'graph/AbstractGraphLabeler.js';

class EmptyGraphLabeler extends AbstractGraphLabeler
{
  constructor()
  {
    super();
  }

  //TODO: this is from GraphController (refactor this out of here pls)
  setGraphController(getGraphController) {}

  //Override
  getDefaultNodeLabel() { return ""; }

  //Override
  getDefaultEdgeLabel() { return ""; }

  //Override
  getNodeLabelFormatter() { return labelFormatter; }

  //Override
  getEdgeLabelFormatter() { return labelFormatter; }
}

function labelFormatter(string)
{
  return string || "";
}

export default EmptyGraphLabeler;
