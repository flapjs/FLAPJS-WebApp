import { EMPTY } from 'machine/Symbols.js';

const MESSAGE_ERROR_EDGE_PLACEHOLDER = "Incomplete transitions";
const MESSAGE_ERROR_EDGE_EMPTY = "Empty transitions";
const MESSAGE_ERROR_EDGE_DUPE = "Duplicate transitions";

const MESSAGE_ERROR_NODE_UNREACHABLE = "Unreachable node";
const MESSAGE_ERROR_NODE_MISSING = "Missing transitions";

class DFAErrorChecker
{
  constructor(machineBuilder, graph)
  {
    this.machineBuilder = machineBuilder;
    this.graph = graph;

    this.errorNodes = [];
    this.errorEdges = [];
  }

  checkErrors(callback)
  {
    //HACK: This will only run for "DFA" machine types...
    if (this.machineBuilder.getMachineType() != "DFA") return;

    const machine = this.machineBuilder.getMachine();
    const graph = this.graph;
    const alphabet = machine.getAlphabet();
    const nodeTargets = this.errorNodes;
    const edgeTargets = this.errorEdges;
    nodeTargets.length = 0;
    edgeTargets.length = 0;

    let nodeTransitionMap = new Map();
    let unReachedNode = graph.nodes.slice();
    let startNode = graph.getStartNode();
    unReachedNode.splice(unReachedNode.indexOf(startNode),1);

    const placeholderEdges = [];
    const emptyEdges = [];
    const dupeEdges = [];
    for(const edge of graph.edges)
    {
      //check incomplete edges
      if (edge.isPlaceholder())
      {
        //Update cached error targets
        placeholderEdges.push(edge.label);
        if (edgeTargets.indexOf(edge) == -1) edgeTargets.push(edge);
      }
      else
      {
        const from = edge.from;
        const to = edge.to;
        const labels = edge.label.split(",");

        for(const label of labels)
        {
          //remove to from unReachedNode list
          if(unReachedNode.includes(to)) unReachedNode.splice(unReachedNode.indexOf(to),1);

          //check for empty transitions
          if(label == EMPTY)
          {
            //Update cached error targets
            emptyEdges.push(edge.label);
            if (edgeTargets.indexOf(edge) == -1) edgeTargets.push(edge);
          }
          else
          {
            if(!nodeTransitionMap.has(from))
            {
              nodeTransitionMap.set(from, [label]);
            }
            else
            {
              //check for duplicate transitions
              const currentAlphabet = nodeTransitionMap.get(from);
              if(currentAlphabet.includes(label))
              {
                //Update cached error targets
                dupeEdges.push(edge.label);
                if (edgeTargets.indexOf(edge) == -1) edgeTargets.push(edge);
              }
              else
              {
                currentAlphabet.push(label);
              }
            }
          }
        }
      }
    }

    const unreachableNodes = [];
    //check disconnect states
    for (const node of unReachedNode)
    {
      //Update cached error targets
      unreachableNodes.push(node.label);
      if (nodeTargets.indexOf(node) == -1) nodeTargets.push(node);
    }

    const missingNodes = [];
    //Check for missing transitions
    for(const node of graph.nodes)
    {
      const nodeTransitions = nodeTransitionMap.get(node);
      if (!nodeTransitions && alphabet.length != 0 ||
        nodeTransitions && nodeTransitions.length < alphabet.length)
      {
        //Update cached error targets
        missingNodes.push(node.label);
        if (nodeTargets.indexOf(node) == -1) nodeTargets.push(node);
      }
    }

    //Callbacks for all collected errors
    if (callback)
    {
      if (placeholderEdges.length > 0) callback(MESSAGE_ERROR_EDGE_PLACEHOLDER, placeholderEdges);
      if (emptyEdges.length > 0) callback(MESSAGE_ERROR_EDGE_EMPTY, emptyEdges);
      if (dupeEdges.length > 0) callback(MESSAGE_ERROR_EDGE_DUPE, dupeEdges);
      if (unreachableNodes.length > 0) callback(MESSAGE_ERROR_NODE_UNREACHABLE, unreachableNodes);
      if (missingNodes.length > 0) callback(MESSAGE_ERROR_NODE_MISSING, missingNodes);
    }

    return !(nodeTargets.length == 0 && edgeTargets.length == 0);
  }
}

export default DFAErrorChecker;
