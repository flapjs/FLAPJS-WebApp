import {stringHash} from 'util/MathHelper.js';

import RE from './machine/RE.js';
import REParser from './machine/REParser.js';
import {convertToNFA} from './machine/REUtils.js';

import ExpressionChangeHandler from './ExpressionChangeHandler.js';

const EXPRESSION_REFRESH_RATE = 30;
// const ERROR_MESSAGE_TAG = 're_parse_error';

class MachineController
{
    constructor()
    {
        this._machine = new RE();
        this._parser = new REParser();
        this._expressionChangeHandler = new ExpressionChangeHandler(EXPRESSION_REFRESH_RATE);

        this._equalFSA = null;
        this._equalREHash = stringHash(this._machine.getExpression());
    }

    update()
    {
        this._expressionChangeHandler.update(this._machine.getExpression());
    }

    clear()
    {
        this.setMachineExpression('');
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
        this.setMachineExpression(nextExpression);
    }

    deleteSymbol(symbol)
    {
        const prevExpression = this._machine.getExpression();
        const nextExpression = prevExpression.replace(new RegExp(symbol, 'g'), '');
        this.setMachineExpression(nextExpression);
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

    setMachineExpression(string)
    {
        this._machine.setExpression(string);
        if (this._machine.validate())
        {
            this._parser.parseRegex(this._machine);
        }
    }

    getMachineExpression()
    {
        return this._machine.getExpression() || '';
    }

    getMachineErrors()
    {
        return this._machine.getErrors();
    }

    getMachine()
    {
        return this._machine;
    }

    getExpressionChangeHandler()
    {
        return this._expressionChangeHandler;
    }
}

export default MachineController;
