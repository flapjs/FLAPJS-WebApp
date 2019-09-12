import Config from 'deprecated/config.js';
import { EMPTY } from 'deprecated/fsa/machine/Symbols.js';

import Notifications from 'deprecated/system/notification/Notifications.js';
import StateUnreachableWarningMessage from 'deprecated/fsa/notifications/StateUnreachableWarningMessage.js';
import TransitionErrorMessage from 'deprecated/fsa/notifications/TransitionErrorMessage.js';

import StateMissingTransitionErrorMessage from 'deprecated/fsa/notifications/StateMissingTransitionErrorMessage.js';

import { getUnreachableNodes } from 'graph2/util/NodeGraphUtils.js';

class FSAErrorChecker
{
    constructor()
    {
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

    checkErrors(shouldNotifyErrors, graphController, machineController)
    {
        const deterministic = machineController.getMachineType() === 'DFA';
        const machineBuilder = machineController.getMachineBuilder();

        const machine = machineBuilder.getMachine();
        const graph = graphController.getGraph();
        const alphabet = machine.getAlphabet();
        const errorNodes = this.errorNodes;
        const errorEdges = this.errorEdges;
        const warnNodes = this.warningNodes;
        const warnEdges = this.warningEdges;
        this.clear();

        let nodeTransitionMap = new Map();

        //Get Unreachable nodes...
        const unreachNodes = getUnreachableNodes(graphController.getGraph());
        for (const node of unreachNodes)
        {
            warnNodes.push(node);
        }

        //Get placeholder / empty / dupe edges...
        const placeholderEdges = [];
        const emptyEdges = [];
        const dupeEdges = [];
        for (const edge of graph.getEdges())
        {
            //check incomplete edges
            if (edge.isPlaceholder())
            {
                //Update cached error targets
                placeholderEdges.push(edge);
                if (errorEdges.indexOf(edge) == -1) errorEdges.push(edge);
            }
            //Ignore dupe/empty edges for nondeterministic
            else if (deterministic)
            {
                const from = edge.getEdgeFrom();
                const labels = edge.getEdgeSymbolsFromLabel();

                for (const label of labels)
                {
                    //check for empty transitions
                    if (label == EMPTY)
                    {
                        //Update cached error targets
                        emptyEdges.push(edge);
                        if (errorEdges.indexOf(edge) == -1) errorEdges.push(edge);
                    }
                    else
                    {
                        if (!nodeTransitionMap.has(from))
                        {
                            nodeTransitionMap.set(from, [label]);
                        }
                        else
                        {
                            //check for duplicate transitions
                            const currentAlphabet = nodeTransitionMap.get(from);
                            if (currentAlphabet.includes(label))
                            {
                                //Update cached error targets
                                dupeEdges.push(edge);
                                if (errorEdges.indexOf(edge) == -1) errorEdges.push(edge);
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

        //Get missing nodes...
        const missingNodes = [];
        if (deterministic)
        {
            //Check for missing transitions
            for (const node of graph.getNodes())
            {
                const nodeTransitions = nodeTransitionMap.get(node);
                if (!nodeTransitions && alphabet.length != 0 ||
                    nodeTransitions && nodeTransitions.length < alphabet.length)
                {
                    //Get the required missing symbols
                    /*
          let array;
          if (nodeTransitions)
          {
            array = [];
            for(const symbol of alphabet)
            {
              if (!nodeTransitions.includes(symbol))
              {
                array.push(symbol);
              }
            }
          }
          else
          {
            array = alphabet.slice();
          }
          */

                    //Update cached error targets
                    missingNodes.push(node);
                    if (errorNodes.indexOf(node) == -1) errorNodes.push(node);
                }
            }
        }

        const result = !(errorNodes.length === 0 && errorEdges.length === 0 &&
            warnNodes.length === 0 && warnEdges.length === 0);

        //Callbacks for all collected errors
        if (shouldNotifyErrors)
        {
            const messageTag = Config.MACHINE_ERRORS_MESSAGE_TAG;
            //Clear the existing messages
            Notifications.clearMessages(messageTag);

            //No errors!
            if (!result)
            {
                Notifications.addMessage(I18N.toString('message.error.none'), 'success', messageTag, null, null, false);
            }
            //There are some errors/warnings...
            else
            {
                const props = { graphController: graphController, machineController: machineController };

                //Add new warning messages
                if (unreachNodes.length > 0)
                {
                    Notifications.addMessage(unreachNodes,
                        'warning', messageTag, StateUnreachableWarningMessage, props, false);
                }
                //Add new error messages
                if (placeholderEdges.length > 0)
                {
                    Notifications.addMessage({ text: I18N.toString('message.error.incomplete'), targets: placeholderEdges },
                        'error', messageTag, TransitionErrorMessage, props, false);
                }
                if (emptyEdges.length > 0)
                {
                    Notifications.addMessage({ text: I18N.toString('message.error.empty'), targets: emptyEdges },
                        'error', messageTag, TransitionErrorMessage, props, false);
                }
                if (dupeEdges.length > 0)
                {
                    Notifications.addMessage({ text: I18N.toString('message.error.dupe'), targets: dupeEdges },
                        'error', messageTag, TransitionErrorMessage, props, false);
                }
                if (missingNodes.length > 0)
                {
                    Notifications.addMessage({ targets: missingNodes },
                        'error', messageTag, StateMissingTransitionErrorMessage, props, false);
                }
            }
        }

        return result;
    }
}

export default FSAErrorChecker;
