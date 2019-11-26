import { convertToDFA, invertDFA } from './FSAUtils.js';
import GraphLayout from '@flapjs/services/graph/util/GraphLayout.js';

import MachineController from '@flapjs/services/machine/controller/MachineController.js';
import FSAMachineBuilder from './FSAMachineBuilder.js';

class FSAMachineController extends MachineController
{
    constructor()
    {
        super(new FSAMachineBuilder());

        // TODO: This is not yet used by anything...
        this.session = null;
    }
    
    setSession(session)
    {
        this.session = session;
        return this;
    }

    setGraphToMachine(graph, machine)
    {
        this.getMachineBuilder().attemptBuildGraph(machine, graph);
        
        //Auto layout graph
        GraphLayout.applyLayout(graph);
    }

    convertMachineTo(machineType)
    {
        const currentMachineType = this.getMachine().isDeterministic() ? 'DFA' : 'NFA';

        //Already converted machine...
        if (currentMachineType === machineType) return;

        if (machineType == 'DFA' && currentMachineType == 'NFA')
        {
            const result = convertToDFA(this.getMachine());
            this.setGraphToMachine(this._graphController.getGraph(), result);
            this.getMachine().setDeterministic(true);
        }
        else if (machineType == 'NFA' && currentMachineType == 'DFA')
        {
            this.getMachine().setDeterministic(false);
        }
        else
        {
            throw new Error('Conversion scheme between \'' + currentMachineType + '\' to \'' + machineType + '\' is not supported');
        }
    }

    invertMachine()
    {
        const machine = this.getMachineBuilder().getMachine();
        const result = invertDFA(machine, machine);

        //Update final states
        for(const state of result.getStates())
        {
            const src = state.getSource();
            src.setNodeAccept(machine.isFinalState(state));
        }
    }

    deleteSymbol(symbol)
    {
        let edge = null;
        let index = null;
        let result = null;
        const targets = [];

        const graph = this.getGraphController().getGraph();
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
                    edge.setEdgeLabel('');
                    graph.deleteEdge(edge);
                }
                targets.push(edge);
            }
        }

        /*
        if (targets.length <= 0)
        {
            this.getMachineBuilder().removeCustomSymbol(symbol);
        }
        */
    }

    renameSymbol(prevSymbol, nextSymbol)
    {
        let edge = null;
        let result = null;
        const targets = [];

        const graph = this.getGraphController().getGraph();
        const length = graph.getEdges().length;
        for(let i = 0; i < length; ++i)
        {
            edge = graph.getEdges()[i];
            result = edge.getEdgeLabel().replace(prevSymbol, nextSymbol);
            if (result != edge.getEdgeLabel())
            {
                targets.push(edge);
            }
            edge.setEdgeLabel(result);
        }

        /*
        if (targets.length <= 0)
        {
            this.getMachineBuilder().renameCustomSymbol(prevSymbol, nextSymbol);
        }
        */
    }
}

export default FSAMachineController;
