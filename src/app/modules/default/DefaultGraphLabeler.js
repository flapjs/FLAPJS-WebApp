import AbstractGraphLabeler from 'graph/AbstractGraphLabeler.js';

class DefaultGraphLabeler extends AbstractGraphLabeler
{
  constructor()
  {
    super();
  }

  //Override
  getNodeLabelFormatter()
  {
    return labelFormatter;
  }

  //Override
  getEdgeLabelFormatter()
  {
    return labelFormatter;
  }
}

function labelFormatter(string)
{
  return string || "";
}

export default DefaultGraphLabeler;
