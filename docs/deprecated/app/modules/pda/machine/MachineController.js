import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';

import PDABuilder from 'modules/pda/machine/PDABuilder.js';

import GraphLayout from 'modules/fsa2/GraphLayout.js';

class MachineController extends AbstractMachineController
{
    constructor(module)
    {
        super(module, new PDABuilder());

        this.graphController = null;
    }

    /** @override */
    initialize(module)
    {
        super.initialize(module);

        this.graphController = module.getGraphController();
    }

    /** @override */
    destroy(module)
    {
        super.destroy(module);
    }

    /** @override */
    update(module)
    {
        super.update(module);
    }

    getFirstGraphNodeByLabel(graph, label)
    {
        for (const node of graph.getNodes())
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
        this._machineBuilder.attemptBuildGraph(machine, graph);

        //Auto layout graph
        GraphLayout.applyLayout(graph);
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
        for (let i = graph.getEdges().length - 1; i >= 0; --i)
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
        for (let i = 0; i < length; ++i)
        {
            edge = graph.getEdges()[i];
            result = edge.getEdgeLabel().replace(prevSymbol, nextSymbol);
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
        for (let i = graph.getEdges().length - 1; i >= 0; --i)
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
        for (let i = 0; i < length; ++i)
        {
            edge = graph.getEdges()[i];
            result = edge.getEdgeLabel().replace(prevSymbol, nextSymbol);
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
