import Config from 'config.js';
import { EMPTY } from 'machine/Symbols.js';
import { NO_MORE_ERRORS, INCOMPLETE_TRANSITION } from 'lang.js';

import StateUnreachableWarningMessage from './error/StateUnreachableWarningMessage.js';
import TransitionErrorMessage from './error/TransitionErrorMessage.js';
import SuccessMessage from 'notification/SuccessMessage.js';

class NFAErrorChecker
{
  constructor(machineBuilder, graph)
  {
    this.machineBuilder = machineBuilder;
    this.graph = graph;

    this.errorNodes = [];
    this.errorEdges = [];
    this.warningNodes = [];
    this.warningEdges = [];
  }

  clear()
  {
    this.errorNodes.length = 0;
    this.errorEdges.length = 0;
    this.warningNodes.length = 0;
    this.warningEdges.length = 0;
  }

  checkErrors(notification=null)
  {
    const machine = this.machineBuilder.getMachine();
    const graph = this.graph;
    const alphabet = machine.getAlphabet();
    const errorNodes = this.errorNodes;
    const errorEdges = this.errorEdges;
    const warnNodes = this.warningNodes;
    const warnEdges = this.warningEdges;
    this.clear();

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
        if (errorEdges.indexOf(edge) == -1) errorEdges.push(edge);
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
        }
      }
    }

    //check disconnect states
    for (const node of unReachedNode)
    {
      if (warnNodes.indexOf(node) == -1) warnNodes.push(node);
    }

    const result = !(errorNodes.length == 0 && errorEdges.length == 0 &&
      warnNodes.length == 0 && warnEdges.length == 0);

    //Callbacks for all collected errors
    if (notification)
    {
      const messageTag = Config.MACHINE_ERRORS_MESSAGE_TAG;
      //Clear the existing messages
      notification.clearMessage(messageTag);

      //No errors!
      if (!result)
      {
        notification.addMessage(NO_MORE_ERRORS, messageTag, SuccessMessage, false);
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
      }
    }

    return result;
  }
}

export default NFAErrorChecker;
