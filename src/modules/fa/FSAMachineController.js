// import { convertToDFA, invertDFA } from './machine/FSAUtils.js';
// import GraphLayout from './graph/GraphLayout.js';

import MachineController from '@flapjs/systems/graph/controller/MachineController.js';
import FSAMachineBuilder from './FSAMachineBuilder.js';

class FSAMachineController extends MachineController
{
    constructor()
    {
        super(new FSAMachineBuilder());
    }

    setSession(session)
    {
        this.session = session;
        return this;
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
