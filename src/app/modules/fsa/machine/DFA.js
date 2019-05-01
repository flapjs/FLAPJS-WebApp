import FSA from './FSA.js';

const SRC = 0;
const SYMBOL = 1;
const DST = 2;

class DFA extends FSA
{
    constructor() { super(); }

    validate() { throw new Error('This is deprecated, please use FSA.isValidDFA()'); }

    /** @override */
    newTransition(fromState, toState, symbol)
    {
        if (!this._states.includes(fromState)) throw new Error('State \'' + fromState + '\' does not exist.');
        if (!this._states.includes(toState)) throw new Error('State \'' + toState + '\' does not exist.');

        for (const transition of this._transitions)
        {
            //Check if already exists...
            if (transition[SRC] == fromState && transition[SYMBOL] == symbol && transition[DST] == toState)
            {
                return;
            }
            //Check if valid deterministic transition...
            else if (transition[SRC] == fromState && transition[SYMBOL] == symbol)
            {
                throw new Error('Unable to create illegal non-deterministic transition for DFA.');
            }
        }

        //Create new transition
        this._transitions.push([fromState, symbol, toState]);
    }
}

export default DFA;
