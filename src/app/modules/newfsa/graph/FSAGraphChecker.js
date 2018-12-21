const EDGE_SYMBOL_SEPARATOR = ' ';

export function checkErrors(graph)
{
  const errors = [];
  if (fsa.isDeterministic())
  {

  }
  else
  {
  }
  return errors;
}

export function getUnreachableStates(graph)
{

}

export function getMissingTransitions(graph)
{
  
}

export function getDuplicateStates(graph)
{
  const nodeMapping = new Map();
  const nodeLabels = new Set();
  for(const node of graph.getNodes())
  {
    const label = node.getNodeLabel();
    if (nodeLabels.has(label))
    {
      let nodes;
      if (nodeMapping.has(label))
      {
        nodes = nodeMapping.get(label);
      }
      else
      {
        nodeMapping.set(label, nodes = []);
      }
      nodes.push(state);
    }
    else
    {
      nodeLabels.add(label);
    }
  }
  return nodeMapping;
}

export function getDuplicateTransitions(graph)
{
  const result = [];
  const edgeMapping = new Map();
  for(const edge of graph.getEdges())
  {
    const source = edge.getSourceNode();
    const symbols = edge.getEdgeLabel().split(EDGE_SYMBOL_SEPARATOR);
    for(const symbol of symbols)
    {
      let edgeSources;
      if (edgeMapping.has(symbol))
      {
        edgeSources = edgeMapping.get(symbol);
      }
      else
      {
        edgeMapping.set(symbol, edgeSources = new Set());
      }

      if (edgeSources.has(source))
      {
        result.push([edge, symbol]);
      }
    }
    //TODO: ...
  }
}

export function getEmptyTransitions(graph)
{
  const result = [];
  for(const edge of graph.getEdges())
  {
    if (edge.getEdgeLabel().includes(FSA.EMPTY_SYMBOL))
    {
      result.push(edge);
    }
  }
  return result;
}

export function getPlaceholderTransitions(graph)
{
  const result = [];
  for(const edge of graph.getEdges())
  {
    if (!edge.getDestinationNode())
    {
      result.push(edge);
    }
  }
  return result;
}

//Unreachable States (cannot be reached from start state)
//Missing Transition (missing transition for state)
//Dupe States (states with the same name)
//Dupe Transition (duplicate symbol transitions)
//Invalid Transition (empty transitions)
//Incomplete transitions (placeholders)
class FSAErrorChecker
{
  constructor(fsa)
  {
    this._machine = fsa;
    this._errors = [];
  }

  checkErrors()
  {
    if (this._machine.isDeterministic())
    {
      return this.checkDFAErrors();
    }
    else
    {
      return this.checkNFAErrors();
    }
  }

  checkDFAErrors()
  {
    this._errors.length = 0;
    return this._errors;
  }

  checkNFAErrors()
  {
    this._errors.length = 0;
    return this._errors;
  }
}

export default FSAErrorChecker;
