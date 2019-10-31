import BroadcastHandler from 'session/manager/broadcast/BroadcastHandler.js';

import { JSON as JSONGraphParser } from 'modules/fsa2/FSAGraphParser.js';
import FSA from 'modules/fsa2/machine/FSA.js';
import { isEquivalentFSA } from 'modules/fsa2/machine/FSAUtils.js';
import { isEquivalentFSAWithWitness } from './machine/util/EqualFSA';

const MACHINE_REQUEST_MESSAGE_TYPE = 'fsa-machine-request';
const MACHINE_RESPONSE_MESSAGE_TYPE = 'fsa-machine-response';

class FSABroadcastHandler extends BroadcastHandler
{
    constructor()
    {
        super();
    }

    testEquivalence(targetSessionID)
    {
        this._broadcastManager.sendMessageTo(targetSessionID, MACHINE_REQUEST_MESSAGE_TYPE);
    }

    /** @override */
    onBroadcastMessage(type, src, dst, message)
    {
        if (type === MACHINE_REQUEST_MESSAGE_TYPE)
        {
            const graph = this._broadcastManager.getApp().getSession()
                .getCurrentModule()
                .getGraphController()
                .getGraph();
            const graphData = JSONGraphParser.objectify(graph);
            this._broadcastManager.sendMessageTo(src, MACHINE_RESPONSE_MESSAGE_TYPE, {
                graphData: graphData
            });
            return true;
        }
        else if (type === MACHINE_RESPONSE_MESSAGE_TYPE)
        {
            const machineController = this._broadcastManager.getApp().getSession()
                .getCurrentModule()
                .getMachineController();
            const graphData = message['graphData'];
            const graph = JSONGraphParser.parse(graphData);
            const machine = machineController
                .getMachineBuilder()
                .attemptBuild(graph, new FSA());
            const currentMachine = machineController.getMachineBuilder().getMachine();

            // changed isEquivalentFSA to isEquivalentFSAWithWitness
            const result = isEquivalentFSAWithWitness(machine, currentMachine);

            // changed result to result.value, needed information from the user to show witness string
            window.alert('The machines are ' + (result.value ? 'EQUAL' : 'NOT EQUAL') + '!');
            return true;
        }

        return false;
    }
}

export default FSABroadcastHandler;
