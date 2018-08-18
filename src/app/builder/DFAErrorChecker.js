import Config from 'config.js';
import { EMPTY } from 'machine/Symbols.js';
import { NO_MORE_ERRORS, INCOMPLETE_TRANSITION, EMPTY_TRANSITION, DUPLICATE_TRANSITION, MISSING_TRANSITION } from 'lang.js';

import StateUnreachableWarningMessage from './error/StateUnreachableWarningMessage.js';
import TransitionErrorMessage from './error/TransitionErrorMessage.js';
import StateErrorMessage from './error/StateErrorMessage.js';

class DFAErrorChecker
{
  constructor(machineBuilder, graph)
  {
    this.machineBuilder = machineBuilder;
    this.graph = graph;

    this.errorNodes = [];
    this.errorEdges = [];
  }

  clear()
  {
    this.errorNodes.length = 0;
    this.errorEdges.length = 0;
  }

  checkErrors(notification=null)
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
        placeholderEdges.push(edge);
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
            emptyEdges.push(edge);
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
                dupeEdges.push(edge);
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

    //check disconnect states
    for (const node of unReachedNode)
    {
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
        missingNodes.push(node);
        if (nodeTargets.indexOf(node) == -1) nodeTargets.push(node);
      }
    }

    const result = !(nodeTargets.length == 0 && edgeTargets.length == 0);

    //Callbacks for all collected errors
    if (notification)
    {
      const messageTag = Config.MACHINE_ERRORS_MESSAGE_TAG;
      //Clear the existing messages
      notification.clearMessage(messageTag);

      //No errors!
      if (!result)
      {
        notification.addMessage(NO_MORE_ERRORS, messageTag, null, false);
      }
      //There are some errors/warnings...
      else
      {
        //Add new warning messages
        if (unReachedNode.length > 0) notification.addMessage(
          unReachedNode, messageTag, StateUnreachableWarningMessage, false);

        //Add new error messages
        if (placeholderEdges.length > 0) notification.addMessage(
          {text: INCOMPLETE_TRANSITION, targets: placeholderEdges},
          messageTag, TransitionErrorMessage, false);
        if (emptyEdges.length > 0) notification.addMessage(
          {text: EMPTY_TRANSITION, targets: emptyEdges},
          messageTag, TransitionErrorMessage, false);
        if (dupeEdges.length > 0) notification.addMessage(
          {text: DUPLICATE_TRANSITION, targets: dupeEdges},
          messageTag, TransitionErrorMessage, false);
        if (missingNodes.length > 0) notification.addMessage(
          {text: MISSING_TRANSITION, targets: missingNodes},
          messageTag, StateErrorMessage, false);
      }
    }

    return result;
  }
}

export default DFAErrorChecker;
