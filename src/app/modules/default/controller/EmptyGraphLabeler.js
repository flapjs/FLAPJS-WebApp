import AbstractGraphLabeler from 'graph/AbstractGraphLabeler.js';

class EmptyGraphLabeler extends AbstractGraphLabeler
{
  constructor()
  {
    super();
  }

  //Override
  getDefaultNodeLabel() { return ""; }

  //Override
  getDefaultEdgeLabel() { return ""; }

  //Override
  getEdgeLabelFormatter() { return edgeLabelFormatter; }
}

function edgeLabelFormatter(string)
{
  return string || "";
}

export default EmptyGraphLabeler;
