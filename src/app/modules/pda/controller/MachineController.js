import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';

import PDABuilder from 'modules/pda/machine/PDABuilder.js';

import GraphLayout from 'modules/fsa/graph/GraphLayout.js';

class MachineController extends AbstractMachineController
{
  constructor(module)
  {
    super(module, new PDABuilder());

    this.graphController = null;
  }

  //Override
  initialize(module)
  {
    super.initialize(module);

    this.graphController = module.getGraphController();
  }

  //Override
  destroy(module)
  {
    super.destroy(module);
  }

  //Override
  update(module)
  {
    super.update(module);
  }

  getFirstGraphNodeByLabel(graph, label)
  {
    for(const node of graph.getNodes())
    {
      if (node.getNodeLabel() == label)
      {
        return node;
      }
    }

    return null;
  }

  setGraphToMachine(graph, machine)
  {
    graph.clear();

    //Add all states
    let node;
    for(const state of machine.getStates())
    {
      node = graph.createNode(0, 0);
      node.setNodeLabel(state);
      if (machine.isFinalState(state))
      {
        node.setNodeAccept(true);
      }
    }

    //Add all transitions
    let edge, from, to, read, labels, flag;
    for(let transition of machine.getTransitions())
    {
      from = this.getFirstGraphNodeByLabel(graph, transition[0]);
      read = transition[1];
      to = this.getFirstGraphNodeByLabel(graph, transition[2]);
      edge = graph.createEdge(from, to);
      edge.setEdgeLabel(read);
      const formattedEdge = graph.formatEdge(edge);
      if (edge != formattedEdge) graph.deleteEdge(edge);
    }

    //Set start state
    const startState = machine.getStartState();
    graph.setStartNode(this.getFirstGraphNodeByLabel(graph, startState));

    //Auto layout graph
    GraphLayout.applyLayout(graph);
  }

  getUnreachableNodes()
  {
    const graphController = this.graphController;
    const graph = graphController.getGraph();
    if (graph.getNodeCount() <= 1) return [];

    const edges = graph.getEdges();
    const nodes = graph.getNodes().slice();
    const startNode = nodes.shift();
    let nextNodes = [];
    nextNodes.push(startNode);

    while(nextNodes.length > 0)
    {
      const node = nextNodes.pop();
      for(const edge of edges)
      {
        if (edge.getSourceNode() === node)
        {
          const i = nodes.indexOf(edge.getDestinationNode());
          if (i >= 0)
          {
            const nextNode = nodes.splice(i, 1)[0];
            nextNodes.push(nextNode);
          }
        }
      }
    }

    return nodes;
  }

  getStates()
  {
    return this._machineBuilder.getMachine().getStates();
  }

  countStates()
  {
    return this.getStates().length;
  }

  getFinalStates()
  {
    return this._machineBuilder.getMachine().getFinalStates();
  }

  getTransitions()
  {
    return this._machineBuilder.getMachine().getTransitions();
  }

  getAlphabet()
  {
    const machine = this._machineBuilder.getMachine();
    return Array.from(machine.getAlphabet());
  }

  isUsedSymbol(symbol)
  {
    return !this.isCustomSymbol(symbol);
  }

  createSymbol(symbol)
  {
    this.addCustomSymbol(symbol);
  }

  deleteSymbol(symbol)
  {
    let edge = null;
    let index = null;
    let result = null;
    const targets = [];

    const graph = this.graphController.getGraph();
    for(let i = graph.getEdges().length - 1; i >= 0; --i)
    {
      edge = graph.getEdges()[i];
      index = edge.getEdgeLabel().indexOf(symbol);
      if (index >= 0)
      {
        result = edge.getEdgeLabel().substring(0, index) + edge.getEdgeLabel().substring(index + 1);
        if (result.length > 0)
        {
          edge.setEdgeLabel(result);
        }
        else
        {
          edge.setEdgeLabel("");
          graph.deleteEdge(edge);
        }
        targets.push(edge);
      }
    }

    if (targets.length <= 0)
    {
      this.getMachineBuilder().removeCustomSymbol(symbol);
    }
  }

  renameSymbol(prevSymbol, nextSymbol)
  {
    let edge = null;
    let result = null;
    const targets = [];

    const graph = this.graphController.getGraph();
    const length = graph.getEdges().length;
    for(let i = 0; i < length; ++i)
    {
      edge = graph.getEdges()[i];
      let result = edge.getEdgeLabel().replace(prevSymbol, nextSymbol);
      if (result != edge.getEdgeLabel())
      {
        targets.push(edge);
      }
      edge.setEdgeLabel(result);
    }

    if (targets.length <= 0)
    {
      this.getMachineBuilder().renameCustomSymbol(prevSymbol, nextSymbol);
    }
  }

  getCustomSymbols()
  {
    return Array.from(this._machineBuilder.getMachine().getCustomSymbols());
  }

  isCustomSymbol(symbol)
  {
    return this._machineBuilder.isCustomSymbol(symbol);
  }

  addCustomSymbol(symbol)
  {
    this._machineBuilder.getMachine().setCustomSymbol(symbol);
  }

  clearCustomSymbols()
  {
    this._machineBuilder.getMachine().clearCustomSymbols();
  }

  getStackAlphabet()
  {
    const machine = this._machineBuilder.getMachine();
    return Array.from(machine.getStackAlphabet());
  }

  isUsedStackSymbol(symbol)
  {
    return !this.isCustomStackSymbol(symbol);
  }

  createStackSymbol(symbol)
  {
    this.addCustomStackSymbol(symbol);
  }

  deleteStackSymbol(symbol)
  {
    let edge = null;
    let index = null;
    let result = null;
    const targets = [];

    const graph = this.graphController.getGraph();
    for(let i = graph.getEdges().length - 1; i >= 0; --i)
    {
      edge = graph.getEdges()[i];
      index = edge.getEdgeLabel().indexOf(symbol);
      if (index >= 0)
      {
        result = edge.getEdgeLabel().substring(0, index) + edge.getEdgeLabel().substring(index + 1);
        if (result.length > 0)
        {
          edge.setEdgeLabel(result);
        }
        else
        {
          edge.setEdgeLabel("");
          graph.deleteEdge(edge);
        }
        targets.push(edge);
      }
    }

    if (targets.length <= 0)
    {
      this.getMachineBuilder().removeCustomStackSymbol(symbol);
    }
  }

  renameStackSymbol(prevSymbol, nextSymbol)
  {
    let edge = null;
    let result = null;
    const targets = [];

    const graph = this.graphController.getGraph();
    const length = graph.getEdges().length;
    for(let i = 0; i < length; ++i)
    {
      edge = graph.getEdges()[i];
      let result = edge.getEdgeLabel().replace(prevSymbol, nextSymbol);
      if (result != edge.getEdgeLabel())
      {
        targets.push(edge);
      }
      edge.setEdgeLabel(result);
    }

    if (targets.length <= 0)
    {
      this.getMachineBuilder().renameCustomStackSymbol(prevSymbol, nextSymbol);
    }
  }

  getCustomStackSymbols()
  {
    return Array.from(this._machineBuilder.getMachine().getCustomStackSymbols());
  }

  isCustomStackSymbol(symbol)
  {
    return this._machineBuilder.isCustomStackSymbol(symbol);
  }

  addCustomStackSymbol(symbol)
  {
    this._machineBuilder.getMachine().setCustomStackSymbol(symbol);
  }

  clearCustomStackSymbols()
  {
    this._machineBuilder.getMachine().clearCustomStackSymbols();
  }
}

export default MachineController;
