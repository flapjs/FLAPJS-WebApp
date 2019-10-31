import CFG, {Rule} from './machine/CFG.js';
import {convertToPDA} from './machine/CFGUtil.js';

import GrammarChangeHandler from './GrammarChangeHandler.js';

const EXPRESSION_REFRESH_RATE = 30;

class MachineController
{
    constructor()
    {
        this._machine = new CFG();
        this._grammarChangeHandler = new GrammarChangeHandler(EXPRESSION_REFRESH_RATE);

        this._equalPDA = null;
        this._equalCFGHash = this._machine.getHashCode();
    }

    update()
    {
        this._grammarChangeHandler.update(this._machine);
    }

    clear()
    {
        this.getMachine().clear();
    }

    isSymbol(symbol)
    {
        return this._machine.hasTerminal(symbol);
    }

    isUsedSymbol(symbol)
    {
        return this.isSymbol(symbol);
    }

    renameSymbol(symbol, nextSymbol)
    {
        const prevRules = this._machine.getRules();
        const newRules = [];
        for(const rule of prevRules)
        {
            const newRule = new Rule(rule.getLHS().replace(new RegExp(symbol, 'g'), nextSymbol),
                rule.getRHS().replace(new RegExp(symbol, 'g'), nextSymbol));
            newRules.push(newRule);
        }
        this.setMachineRules(newRules);
        this._machine.removeTerminal(symbol);
        this._machine.addTerminal(nextSymbol);
    }

    deleteSymbol(symbol)
    {
        const prevRules = this._machine.getRules();
        const newRules = [];
        for(const rule of prevRules)
        {
            const newRule = new Rule(rule.getLHS().replace(new RegExp(symbol, 'g'), ''),
                rule.getRHS().replace(new RegExp(symbol, 'g'), ''));
            newRules.push(newRule);
        }
        this.setMachineRules(newRules);
        this._machine.removeTerminal(symbol);
    }

    isVariable(variable)
    {
        return this._machine.hasVariable(variable);
    }

    isUsedVariable(variable)
    {
        return this.isVariable(variable);
    }

    renameVariable(variable, nextVariable)
    {
        const prevRules = this._machine.getRules();
        const newRules = [];
        for(const rule of prevRules)
        {
            const newRule = new Rule(rule.getLHS().replace(new RegExp(variable, 'g'), nextVariable),
                rule.getRHS().replace(new RegExp(variable, 'g'), nextVariable));
            newRules.push(newRule);
        }
        this.setMachineRules(newRules);
        this._machine.removeVariable(variable);
        this._machine.addVariable(nextVariable);
    }

    /**
     * Deletes variable from rhs of rules as well as removing any rules where the lhs is this variable
     */
    deleteVariable(variable)
    {
        const prevRules = this._machine.getRules();
        const newRules = [];
        for(const rule of prevRules)
        {
            if(rule.getLHS() != variable)
            {
                const newRule = new Rule(rule.getLHS(), rule.getRHS().replace(new RegExp(variable, 'g'), ''));
                newRules.push(newRule);
            }
        }
        this.setMachineRules(newRules);
        this._machine.removeVariable(variable);
    }

    addMachineRule(rule)
    {
        this._machine.addRule(rule);
    }

    setMachineRules(rules)
    {
        this._machine.clearRules();
        for(const rule of rules)
        {
            this.addMachineRule(rule);
        }
    }

    getMachineTerminals()
    {
        return Array.from(this._machine.getTerminals());
    }

    getMachineVariables()
    {
        return Array.from(this._machine.getVariables());
    }

    getMachineRules()
    {
        return this._machine.getRules();
    }

    getMachineStartVariable()
    {
        return this._machine.getStartVariable();
    }

    getEquivalentPDA()
    {
        if(!this._equalPDA || this._machine.getHashCode() !== this._equalCFGHash)
        {
            this._equalCFGHash = this._machine.getHashCode();
            this._equalPDA = convertToPDA(this._machine);
        }
        return this._equalPDA;
    }

    getMachineErrors()
    {
        return this._machine.getErrors();
    }

    getMachine()
    {
        return this._machine;
    }

    setMachine(machine)
    {
        this._machine = machine;
    }

    getGrammarChangeHandler()
    {
        return this._grammarChangeHandler;
    }

}

export default MachineController;
