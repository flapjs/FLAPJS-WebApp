import Config from 'config.js';
import { EMPTY } from 'machine/Symbols.js';

import Notifications from 'system/notification/Notifications.js';
import StateUnreachableWarningMessage from 'modules/fsa/notifications/StateUnreachableWarningMessage.js';
import TransitionErrorMessage from 'modules/fsa/notifications/TransitionErrorMessage.js';

const EDGE_SYMBOL_SEPARATOR = Config.EDGE_SYMBOL_SEPARATOR;

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

  checkErrors(shouldNotifyErrors=false, graphController=null, machineController=null)
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
        const from = edge.getSourceNode();
        const to = edge.getDestinationNode();
        const labels = edge.getEdgeLabel().split(EDGE_SYMBOL_SEPARATOR);

        for(const label of labels)
        {
          //remove to from unReachedNode list
          if (unReachedNode.includes(to)) unReachedNode.splice(unReachedNode.indexOf(to),1);
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
    const messageTag = Config.MACHINE_ERRORS_MESSAGE_TAG;
    //Clear the existing messages
    Notifications.clearMessages(messageTag);

    //No errors!
    if (!result)
    {
      Notifications.addMessage(I18N.toString("message.error.none"), "success", messageTag, null, null, false);
    }
    //There are some errors/warnings...
    else
    {
      const props = {graphController: graphController, machineController: machineController};

      //Add new warning messages
      if (unReachedNode.length > 0)
      {
        Notifications.addMessage(unReachedNode,
          "warning", messageTag, StateUnreachableWarningMessage, props, false);
      }

      //Add new error messages
      if (placeholderEdges.length > 0)
      {
        Notifications.addMessage({text: I18N.toString("message.error.incomplete"), targets: placeholderEdges},
          "error", messageTag, TransitionErrorMessage, props, false);
      }
    }

    return result;
  }

  getUnreachableNodes() {

    const graph = this.graph;

    let unReachedNodes = graph.nodes.slice();

    //keep start state
    //unReachedNodes.splice(unReachedNodes.indexOf(unReachedNode.getStartNode()), 1);
    for(const edge of graph.edges) {
      const labels = edge.label.split(",");
      for(const label of labels) {

        const from = edge.from;
        const to = edge.to;
        //remove to from unReachedNode list
        if(unReachedNodes.includes(to)) unReachedNodes.splice(unReachedNodes.indexOf(to),1);
      }
    }
    return unReachedNodes;
  }
}

export default NFAErrorChecker;
