import AbstractMachineController from 'modules/abstract/AbstractMachineController.js';
import Eventable from 'util/Eventable.js';

//import FSABuilder from 'modules/fsa2/machine/FSABuilder.js';
//HACK: this is only to support the old FSABuilder (remove this once finished)
import FSABuilder from 'deprecated/fsa/builder/FSABuilder.js';

import GraphLayout from 'deprecated/fsa/graph/GraphLayout.js';
import { convertToDFA } from 'deprecated/fsa/machine/util/convertNFA.js';
import DFA from 'deprecated/fsa/machine/DFA.js';

class MachineController extends AbstractMachineController
{
    constructor(module)
    {
        super(module, new FSABuilder());

        this.machineName = null;

        this.graphController = null;

        //userChangeMachine(machineBuilder, nextMachineType, prevMachineType) - when user changes machine type
        this.registerEvent('userChangeMachine');
        //userConvertMachine(machineBuilder, nextMachineType, prevMachineType) - when user converts machine type
        this.registerEvent('userConvertMachine');
        this.registerEvent('userPreConvertMachine');//Before changes
        this.registerEvent('userPostConvertMachine');//After all changes
        //userRenameMachine(machineBuilder, nextMachineName, prevMachineName) - when machine name is changed
        this.registerEvent('userRenameMachine');
        //userCreateSymbol(machineBuilder, symbol) - When user adds a custom symbol
        this.registerEvent('userCreateSymbol');
        //userDeleteSymbol(machineBuilder, symbol, prevEdges) - When user delets a symbol (and affects the edges)
        this.registerEvent('userDeleteSymbol');
        this.registerEvent('userPreDeleteSymbol');//userPreDeleteSymbol(machineBuilder, symbol)
        this.registerEvent('userPostDeleteSymbol');
        //userRenameSymbol(machineBuilder, symbol, prevSymbol, targetEdges) - When user renames a used symbol (and affects the edges)
        this.registerEvent('userRenameSymbol');
        this.registerEvent('userPreRenameSymbol');//userPreDeleteSymbol(machineBuilder, symbol, prevSymbol)
        this.registerEvent('userPostRenameSymbol');
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

    getMachineType()
    {
        //return this._machineBuilder.getMachine().isDeterministic() ? "DFA" : "NFA";
        //HACK: this is only to support the old FSABuilder (remove this once finished)
        return this._machineBuilder.isDeterministic() ? 'DFA' : 'NFA';
    }

    setMachineType(machineType)
    {
        //this._machineBuilder.getMachine().setDeterministic(machineType === 'DFA');
        //HACK: this is only to support the old FSABuilder (remove this once finished)
        this._machineBuilder.setDeterministic(machineType === 'DFA');
    }

    getMachineName()
    {
        return this.machineName || I18N.toString('file.untitled');
    }

    setMachineName(machineName)
    {
        if (!machineName || machineName.length <= 0)
        {
            this.machineName = null;
        }
        else
        {
            this.machineName = machineName;
        }

        const value = this.getMachineName();
        const element = document.getElementById('window-title');
        const string = element.innerHTML;
        const separator = string.indexOf('-');
        if (separator !== -1)
        {
            element.innerHTML = string.substring(0, separator).trim() + ' - ' + value;
        }
        else
        {
            element.innerHTML = string + ' - ' + value;
        }
    }

    renameMachine(machineName)
    {
        const prev = this.machineName;
        this.setMachineName(machineName);

        //Emit a user rename machine event
        this.emit('userRenameMachine', this.getMachineBuilder(), machineName, prev);
    }

    changeMachineTo(machineType)
    {
        const prev = this.getMachineType();
        if (prev != machineType)
        {
            this.setMachineType(machineType);

            //Emit event
            this.emit('userChangeMachine', this.getMachineBuilder(), machineType, prev);
        }
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

    //TODO: REMOTE GHISNAFADSFIGER
    setGraphToMachine(graph, machine)
    {
        graph.clear();

        //Add all states
        let node;
        for (const state of machine.getStates())
        {
            node = graph.createNode(0, 0);
            node.setNodeLabel(state);
            if (machine.isFinalState(state))
            {
                node.setNodeAccept(true);
            }
        }

        //Add all transitions
        let edge, from, to, read;
        for (let transition of machine.getTransitions())
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

    convertMachineTo(machineType)
    {
        const currentMachineType = this.getMachineType();

        //Already converted machine...
        if (currentMachineType === machineType) return;

        if (machineType == 'DFA' && currentMachineType == 'NFA')
        {
            this.emit('userPreConvertMachine', this.getMachineBuilder(), machineType, currentMachineType);

            const result = convertToDFA(this.getMachineBuilder().getMachine(), new DFA());
            this.setGraphToMachine(this.graphController.getGraph(), result);
            this.setMachineType(machineType);

            this.emit('userConvertMachine', this.getMachineBuilder(), machineType, currentMachineType);
            this.emit('userPostConvertMachine', this.getMachineBuilder(), machineType, currentMachineType);
        }
        else if (machineType == 'NFA' && currentMachineType == 'DFA')
        {
            this.changeMachineTo(machineType);
        }
        else
        {
            throw new Error('Conversion scheme between \'' + currentMachineType + '\' to \'' + machineType + '\' is not supported');
        }
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
        const result = [];
        machine.getAlphabet(result);
        return result;
    }

    isUsedSymbol(symbol)
    {
        return !this.isCustomSymbol(symbol);
    }

    createSymbol(symbol)
    {
        this.getMachineBuilder().addCustomSymbol(symbol);

        this.emit('userCreateSymbol', this.getMachineBuilder(), symbol);
    }

    deleteSymbol(symbol)
    {
        let edge = null;
        let index = null;
        let result = null;
        const targets = [];

        this.emit('userPreDeleteSymbol', this.getMachineBuilder(), symbol);

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

        this.emit('userDeleteSymbol', this.getMachineBuilder(), symbol, targets);
        this.emit('userPostDeleteSymbol', this.getMachineBuilder(), symbol, targets);
    }

    renameSymbol(prevSymbol, nextSymbol)
    {
        let edge = null;
        let result = null;
        const targets = [];

        this.emit('userPreRenameSymbol', this.getMachineBuilder(), nextSymbol, prevSymbol);

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

        this.emit('userRenameSymbol', this.getMachineBuilder(), nextSymbol, prevSymbol, targets);
        this.emit('userPostRenameSymbol', this.getMachineBuilder(), nextSymbol, prevSymbol, targets);
    }

    getCustomSymbols()
    {
        //return Array.from(this._machineBuilder.getMachine().getCustomSymbols());
        //HACK: this is only to support the old FSABuilder (remove this once finished)
        return this.getMachineBuilder()._symbols;
    }

    isCustomSymbol(symbol)
    {
        return this._machineBuilder.isCustomSymbol(symbol);
    }

    addCustomSymbol(symbol)
    {
        //this._machineBuilder.getMachine().setCustomSymbol(symbol);
        //HACK: this is only to support the old FSABuilder (remove this once finished)
        this._machineBuilder.addCustomSymbol(symbol);
    }

    clearCustomSymbols()
    {
        //this._machineBuilder.getMachine().clearCustomSymbols();
        //HACK: this is only to support the old FSABuilder (remove this once finished)
        this.getMachineBuilder()._symbols.length = 0;
    }
}
Eventable.mixin(MachineController);

export default MachineController;
