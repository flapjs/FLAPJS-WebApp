import MachineController from '@flapjs/services/machine/controller/MachineController.js';
import { stringHash } from '@flapjs/util/MathHelper.js';

import RE from './RE.js';
import { convertToNFA } from './REUtils.js';

class REMachineController extends MachineController
{
    constructor()
    {
        // TODO: This should be an REBuilder, where it converts an AST into an RE.
        super(null);

        this.session = null;

        this._machine = new RE();

        this._equalFSA = null;
        this._equalREHash = stringHash(this._machine.getExpression());
    }

    setSession(session)
    {
        this.session = session;
        return this;
    }
    
    /** @override */
    getControlledHashCode(self)
    {
        return stringHash(self.getMachine().getExpression());
    }

    clear()
    {
        this.getMachine().setExpression('');
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
        const prevExpression = this._machine.getExpression();
        const nextExpression = prevExpression.replace(new RegExp(symbol, 'g'), nextSymbol);
        this.getMachine().setExpression(nextExpression);
    }

    deleteSymbol(symbol)
    {
        const prevExpression = this._machine.getExpression();
        const nextExpression = prevExpression.replace(new RegExp(symbol, 'g'), '');
        this.getMachine().setExpression(nextExpression);
    }

    getMachineTerminals()
    {
        return Array.from(this._machine.getTerminals());
    }

    getEquivalentFSA()
    {
        if (!this._equalFSA || (stringHash(this._machine.getExpression()) !== this._equalREHash))
        {
            this._equalREHash = stringHash(this._machine.getExpression());
            this._equalFSA = convertToNFA(this._machine);
        }
        return this._equalFSA;
    }

    getMachineErrors()
    {
        return this._machine.getErrors();
    }

    /** @override */
    getMachine()
    {
        return this._machine;
    }
}

export default REMachineController;
