import { guid, stringHash } from '@flapjs/util/MathHelper.js';

// const FROM_STATE_INDEX = 0;
const READ_SYMBOL_INDEX = 1;
const TO_STATE_INDEX = 2;
const POP_SYMBOL_INDEX = 3;
const PUSH_SYMBOL_INDEX = 4;

export const EMPTY_SYMBOL = '&empty';

export class State
{
    constructor(label = '', src = null)
    {
        this._label = label;

        this._src = src;
        this._id = src && typeof src.getGraphElementID === 'function' ? src.getGraphElementID() : guid();
    }

    copy()
    {
        const result = new State();
        result._label = this._label;
        result._src = this._src;
        result._id = this._id;
        return result;
    }

    getStateLabel() { return this._label; }

    getStateID() { return this._id; }
    getSource() { return this._src; }

    getHashString()
    {
        return this._id;
    }
}

export class Transition
{
    constructor(from, to)
    {
        this._from = from;
        this._to = to;
        this._symbols = new Map();
    }

    copy()
    {
        const result = new Transition();
        result._from = this._from;
        result._to = this._to;

        throw new Error('Not yet implemented');
        /*
        result._symbols = this._symbols.slice();

        return result;
        */
    }

    getSourceState() { return this._from; }
    getDestinationState() { return this._to; }

    addSymbol(read, pop, push)
    {
        const symbol = new Symbol(read, pop, push);
        this._symbols.set(symbol.getHashString(), symbol);
    }

    hasSymbol(read, pop = null, push = null)
    {
        for (const symbol of this._symbols.values())
        {
            if (symbol.getReadSymbol() === read)
            {
                if (!pop || symbol.getPopSymbol() === pop)
                {
                    if (!push || symbol.getPushSymbol() === push)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getSymbolsByReadPop(read, pop = null, dst = [])
    {
        for (const symbol of this._symbols.values())
        {
            if (symbol.getReadSymbol() === read)
            {
                if (!pop || symbol.getPopSymbol() === pop)
                {
                    dst.push(symbol);
                }
            }
        }
        return dst;
    }

    getSymbols() { return this._symbols.values(); }

    getHashString()
    {
        let symbolString = '';
        for (const symbol of this._symbols.values())
        {
            symbolString += symbol.getHashString() + ',';
        }
        return this._from.getHashString() + ':' + symbolString + ':' + this._to.getHashString();
    }
}

export class Symbol
{
    constructor(read, pop, push)
    {
        this._read = read;
        this._pop = pop;
        this._push = push;
    }

    getReadSymbol() { return this._read; }
    getPopSymbol() { return this._pop; }
    getPushSymbol() { return this._push; }

    getHashString()
    {
        return this._read + ';' + this._pop + ';' + this._push;
    }
}

class PDA
{
    constructor()
    {
        //state id -> state
        this._states = new Map();
        //symbol -> symbol use counter
        this._alphabet = new Map();
        this._stackAlphabet = new Map();
        //transition key (from + to) -> transition object
        this._transitions = new Map();
        this._finalStates = new Set();
        this._customSymbols = new Set();
        this._customStackSymbols = new Set();
        this._startState = null;

        this._errors = [];
    }

    /**
     * Performs a shallow copy of the 2 machines. Any changes to a state will be
     * reflected in both. However, changes to transitions, alphabet, and final
     * states will not propagate.
     * 
     * @param {PDA} pda The pda instance.
     */
    //FIXME: This is not a valid copy
    copy(pda)
    {
        //You are already yourself, don't copy nothing.
        if (pda === this) return;

        //Make room for the copy...
        this.clear();

        //Copy state
        for (const [key, value] of pda._states.entries())
        {
            const result = value.copy();
            this._states.set(key, result);

            //Copy start state
            if (pda.isStartState(value))
            {
                this._startState = result;
            }
            //Copy final states
            if (pda.isFinalState(value))
            {
                this._finalStates.add(result);
            }
        }
        //Copy alphabet
        for (const [key, value] of pda._alphabet.entries())
        {
            this._alphabet.set(key, value);
        }
        //Copy stack alphabet
        for (const [key, value] of pda._stackAlphabet.entries())
        {
            this._stackAlphabet.set(key, value);
        }
        //Copy transitions
        for (const [key, value] of pda._transitions.entries())
        {
            const result = value.copy();
            result._from = this._states.get(value.getSourceState().getStateID());
            result._to = this._states.get(value.getDestinationState().getStateID());
            this._transitions.set(key, result);
        }
        //Copy custom symbols
        for (const symbol of pda._customSymbols)
        {
            this._customSymbols.add(symbol);
        }
        //Copy custom stack symbols
        for (const symbol of pda._customStackSymbols)
        {
            this._customStackSymbols.add(symbol);
        }

        //Copy errors
        for (const error of pda._errors)
        {
            //WARNING: if the error's store state objects, they need to be redirected to the copies
            this._errors.push(error);
        }
    }

    clear()
    {
        this._states.clear();
        this._alphabet.clear();
        this._stackAlphabet.clear();
        this._transitions.clear();
        this._finalStates.clear();
        this._customSymbols.clear();
        this._customStackSymbols.clear();
        this._startState = null;

        this._errors.length = 0;
    }

    validate()
    {
        //Reset errors
        this._errors.length = 0;
        return true;
    }
    isValid() { return this._errors.length == 0; }
    getErrors() { return this._errors; }

    createState(label = '')
    {
        return this.addState(new State(label));
    }

    addState(state)
    {
        const stateID = state.getStateID();
        if (this._states.has(stateID)) throw new Error('Already added state with id \'' + stateID + '\'');
        //Make state as new start state if no other states exist...
        if (this._states.size <= 0) this._startState = state;
        //Add to state set
        this._states.set(stateID, state);
        return state;
    }

    removeState(state)
    {
        const stateID = state.getStateID();
        if (!this._states.has(stateID)) return false;
        this._states.delete(stateID);

        //Deleted the start state, so must pick another one...
        if (this._startState === state)
        {
            if (this._states.size <= 0)
            {
                //If no more states to choose from, don't choose anything
                this._startState = null;
            }
            else
            {
                //Choose an arbitrary start state
                this._startState = this._states.values().next().value;
            }
        }

        return true;
    }

    hasStateWithLabel(label)
    {
        for (const state of this._states.values())
        {
            if (state.getStateLabel() == label)
            {
                return true;
            }
        }
        return false;
    }

    getStatesByLabel(label, dst = [])
    {
        for (const state of this._states.values())
        {
            if (state.getStateLabel() == label)
            {
                dst.push(state);
            }
        }
        return dst;
    }

    getStateByID(id)
    {
        return this._states.get(id);
    }

    hasState(state) { return this._states.has(state.getStateID()); }

    getStates() { return this._states.values(); }

    getStateCount() { return this._states.size; }

    addTransition(from, to, readSymbol, popSymbol, pushSymbol)
    {
        if (!this.hasState(from)) throw new Error('Trying to add a transition to unknown state with label \'' + from.getStateLabel() + '\'');
        if (!this.hasState(to)) throw new Error('Trying to add a transition to unknown state with label \'' + to.getStateLabel() + '\'');
        if (!readSymbol) throw new Error('Cannot add transition for null read symbol - use the empty symbol instead');
        if (!popSymbol) throw new Error('Cannot add transition for null pop symbol - use the empty symbol instead');
        if (!pushSymbol) throw new Error('Cannot add transition for null push symbol - use the empty symbol instead');

        const transitionKey = from.getStateID() + '->' + to.getStateID();
        if (this._transitions.has(transitionKey))
        {
            const transition = this._transitions.get(transitionKey);
            if (!transition.hasSymbol(readSymbol, popSymbol, pushSymbol))
            {
                transition.addSymbol(readSymbol, popSymbol, pushSymbol);
            }
            else
            {
                //Didn't add anything...
                return false;
            }
        }
        else
        {
            const newTransition = new Transition(from, to);
            newTransition.addSymbol(readSymbol, popSymbol, pushSymbol);
            this._transitions.set(transitionKey, newTransition);
        }

        //Add to alphabet...
        this._incrSymbolCount(readSymbol);
        this._incrStackSymbolCount(popSymbol);
        this._incrStackSymbolCount(pushSymbol);
        return true;
    }

    //FIXME: not yet implemented
    removeTransition(from, to, symbol = null)
    {
        const transitionKey = from.getStateID() + '->' + to.getStateID();
        if (!this._transitions.has(transitionKey)) return false;

        const transition = this._transitions.get(transitionKey);
        const symbols = transition.getSymbols();

        //If deleting a specific symbol...
        if (symbol)
        {
            const index = symbols.indexOf(symbol);
            if (index >= 0)
            {
                //Update symbol counts...
                this._decrSymbolCount(symbol);

                symbols.splice(index, 1);
                if (symbols.length <= 0) this._transitions.delete(transitionKey);
                return true;
            }
            else
            {
                return false;
            }
        }
        //If deleting a all associated symbols...
        else
        {
            //Update symbol counts...
            for (const symbol of symbols)
            {
                this._decrSymbolCount(symbol);
            }

            //Remove transition
            this._transitions.delete(transitionKey);
            return true;
        }
    }

    hasTransition(from, to, symbol = null)
    {
        const transitionKey = from.getStateID() + '->' + to.getStateID();
        if (!this._transitions.has(transitionKey)) return false;
        //Not checking for specific symbols...
        if (!symbol) return true;

        //Find the symbol...
        return this._transitions.get(transitionKey).hasSymbol(symbol);
    }

    getTransitionSymbols(from, to)
    {
        const transitionKey = from.getStateID() + '->' + to.getStateID();
        if (!this._transitions.has(transitionKey)) return null;
        return this._transitions.get(transitionKey).getSymbols();
    }

    getTransitions() { return this._transitions.values(); }

    _incrSymbolCount(symbol)
    {
        //Don't add empty symbol to the alphabet
        if (symbol === EMPTY_SYMBOL) return;

        const symbolCount = this._alphabet.get(symbol) || 0;
        this._alphabet.set(symbol, symbolCount + 1);
    }

    _incrStackSymbolCount(stackSymbol)
    {
        //Don't add empty symbol to the stack alphabet
        if (stackSymbol === EMPTY_SYMBOL) return;

        const symbolCount = this._stackAlphabet.get(stackSymbol) || 0;
        this._stackAlphabet.set(stackSymbol, symbolCount + 1);
    }

    _decrSymbolCount(symbol)
    {
        if (!this._alphabet.has(symbol)) throw new Error('Unable to find valid transition symbol in alphabet');

        //Empty symbol is not in the alphabet
        if (symbol === EMPTY_SYMBOL) return;

        const symbolCount = this._alphabet.get(symbol);
        //Delete the symbol, since it is no longer used...
        if (symbolCount <= 1)
        {
            if (!this.isCustomSymbol(symbol))
            {
                //Regular symbols are removed if unused...
                this._alphabet.delete(symbol);
            }
            else
            {
                //Custom symbols stay in the alphabet, even if unused...
                this._alphabet.set(symbol, 0);
            }
        }
        else
        {
            //Still being used by someone...
            this._alphabet.set(symbol, symbolCount - 1);
        }
    }

    _decrStackSymbolCount(symbol)
    {
        if (!this._stackAlphabet.has(symbol)) throw new Error('Unable to find valid transition symbol in alphabet');

        //Empty symbol is not in the alphabet
        if (symbol === EMPTY_SYMBOL) return;

        const symbolCount = this._stackAlphabet.get(symbol);
        //Delete the symbol, since it is no longer used...
        if (symbolCount <= 1)
        {
            if (!this.isCustomStackSymbol(symbol))
            {
                //Regular symbols are removed if unused...
                this._stackAlphabet.delete(symbol);
            }
            else
            {
                //Custom symbols stay in the alphabet, even if unused...
                this._stackAlphabet.set(symbol, 0);
            }
        }
        else
        {
            //Still being used by someone...
            this._stackAlphabet.set(symbol, symbolCount - 1);
        }
    }

    changeSymbol(symbol, newSymbol)
    {
        if (symbol === EMPTY_SYMBOL) throw new Error('Cannot change the empty symbol');
        if (newSymbol === EMPTY_SYMBOL) throw new Error('Cannot change to the empty symbol');
        if (this._stackAlphabet.has(newSymbol)) throw new Error('Cannot change symbol to another existing symbol');

        throw new Error('Not yet implemented');
    }

    removeSymbol(symbol)
    {
        throw new Error('Not yet implemented');
    }

    setCustomSymbol(symbol, custom = true)
    {
        if (symbol === EMPTY_SYMBOL) throw new Error('Cannot change the empty symbol as a custom symbol');

        if (custom)
        {
            if (!this._customSymbols.has(symbol))
            {
                this._customSymbols.add(symbol);

                //Add symbol to alphabet if missing...
                if (!this._alphabet.has(symbol)) this._alphabet.set(symbol, 0);
            }
        }
        else
        {
            if (this._customSymbols.has(symbol))
            {
                this._customSymbols.delete(symbol);

                //If symbol is unused, delete it
                if (this._alphabet.has(symbol) && this._alphabet.get(symbol) <= 0) this._alphabet.delete(symbol);
            }
        }
    }

    isCustomSymbol(symbol)
    {
        return this._customSymbols.has(symbol);
    }

    getCustomSymbols()
    {
        return this._customSymbols;
    }

    clearCustomSymbols()
    {
        this._customSymbols.clear();
    }

    isUsedSymbol(symbol)
    {
        return this._alphabet.has(symbol) && this._alphabet.get(symbol) > 0;
    }

    isSymbol(symbol)
    {
        return this._alphabet.has(symbol);
    }

    getAlphabet()
    {
        return this._alphabet.keys();
    }

    /********** STACK ALPHABET **********/

    changeStackSymbol(symbol, newSymbol)
    {
        if (symbol === EMPTY_SYMBOL) throw new Error('Cannot change the empty symbol');
        if (newSymbol === EMPTY_SYMBOL) throw new Error('Cannot change to the empty symbol');
        if (this._stackAlphabet.has(newSymbol)) throw new Error('Cannot change symbol to another existing symbol');

        throw new Error('Not yet implemented');
    }

    removeStackSymbol(symbol)
    {
        throw new Error('Not yet implemented');
    }

    setCustomStackSymbol(symbol, custom = true)
    {
        if (symbol === EMPTY_SYMBOL) throw new Error('Cannot change the empty symbol as a custom symbol');

        if (custom)
        {
            if (!this._customStackSymbols.has(symbol))
            {
                this._customStackSymbols.add(symbol);

                //Add symbol to alphabet if missing...
                if (!this._stackAlphabet.has(symbol)) this._stackAlphabet.set(symbol, 0);
            }
        }
        else
        {
            if (this._customStackSymbols.has(symbol))
            {
                this._customStackSymbols.delete(symbol);

                //If symbol is unused, delete it
                if (this._stackAlphabet.has(symbol) && this._stackAlphabet.get(symbol) <= 0) this._stackAlphabet.delete(symbol);
            }
        }
    }

    isCustomStackSymbol(symbol)
    {
        return this._customStackSymbols.has(symbol);
    }

    getCustomStackSymbols()
    {
        return this._customStackSymbols;
    }

    clearCustomStackSymbols()
    {
        this._customStackSymbols.clear();
    }

    isUsedStackSymbol(symbol)
    {
        return this._stackAlphabet.has(symbol) && this._stackAlphabet.get(symbol) > 0;
    }

    isStackSymbol(symbol)
    {
        return this._stackAlphabet.has(symbol);
    }

    getStackAlphabet()
    {
        return this._stackAlphabet.keys();
    }

    /********** OTHER **********/

    setStartState(state)
    {
        const stateID = state.getStateID();
        if (!this._states.has(stateID))
        {
            //Add it to the state set
            this._states.set(stateID, state);
        }
        this._startState = state;
    }
    isStartState(state) { return this._startState === state; }
    getStartState() { return this._startState; }

    setFinalState(state, final = true)
    {
        //Make final
        if (final)
        {
            //If missing from state set, add it in...
            if (!this._states.has(state.getStateID()))
            {
                this.addState(state);
            }

            this._finalStates.add(state);
        }
        else
        {
            //If missing from state set, it would be effectively the same thing as
            //calling addState(state). So due to ambiguity, don't do it.
            if (!this._states.has(state.getStateID())) throw new Error('Trying to change final for missing state \'' + state.getStateLabel() + '\'');

            this._finalStates.delete(state);
        }
    }
    isFinalState(state) { return this._finalStates.has(state); }
    getFinalStates() { return this._finalStates; }

    doTransition(state, readSymbol, stack, dst = [])
    {
        if (!state) return dst;
        if (!(state instanceof State)) throw new Error('Invalid state instance type \'' + (typeof state) + '\'');
        if (!this._states.has(state.getStateID())) throw new Error('Unable to find source state with id \'' + state.getStateID() + '\'');

        if (!readSymbol) readSymbol = EMPTY_SYMBOL;

        const fromTransitionKey = state.getStateID() + '->';
        for (const key of this._transitions.keys())
        {
            if (key.startsWith(fromTransitionKey))
            {
                const transition = this._transitions.get(key);
                const toState = transition.getDestinationState();

                const validSymbols = [];
                transition.getSymbolsByReadPop(readSymbol, stack[stack.length - 1], validSymbols);
                transition.getSymbolsByReadPop(readSymbol, EMPTY_SYMBOL, validSymbols);
                for (const validSymbol of validSymbols)
                {
                    const newStack = stack.slice();
                    const validPop = validSymbol.getPopSymbol();
                    const validPush = validSymbol.getPushSymbol();

                    if (validPop !== EMPTY_SYMBOL) newStack.pop();
                    if (validPush !== EMPTY_SYMBOL) newStack.push(validPush);

                    dst.push([toState, newStack]);
                }
            }
        }
        return dst;
    }

    doTerminalTransition(state, readSymbol, stack, dst = [])
    {
        if (!state) return dst;
        if (!this._states.has(state.getStateID())) throw new Error('Unable to find source state with id \'' + state.getStateID() + '\'');

        if (!readSymbol) readSymbol = EMPTY_SYMBOL;

        const fromTransitionKey = state.getStateID() + '->';
        for (const key of this._transitions.keys())
        {
            if (key.startsWith(fromTransitionKey))
            {
                const transition = this._transitions.get(key);
                const toState = transition.getDestinationState();

                const validSymbols = [];
                transition.getSymbolsByReadPop(readSymbol, stack[stack.length - 1], validSymbols);
                transition.getSymbolsByReadPop(readSymbol, EMPTY_SYMBOL, validSymbols);
                for (const validSymbol of validSymbols)
                {
                    const newStack = stack.slice();
                    const validPop = validSymbol.getPopSymbol();
                    const validPush = validSymbol.getPushSymbol();

                    if (validPop !== EMPTY_SYMBOL)
                    {
                        if (stack.length == 0)
                        {
                            continue;
                        }
                        else
                        {
                            newStack.pop();
                        }

                    }
                    if (validPush !== EMPTY_SYMBOL) newStack.push(validPush);

                    const result = this.doClosureTransition(toState, newStack);
                    for (const s of result)
                    {
                        //Checks if dst includes the new destination and stack pair
                        let flag = false;
                        for (const pair of dst)
                        {
                            if (pair[0] === s[0])
                            {
                                if (isEqualStack(pair[1], s[1]))
                                {
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if (!flag) dst.push(s);
                    }
                }
            }
        }

        return dst;
    }

    doClosureTransition(state, stack, dst = [])
    {
        if (!state) return dst;

        dst.push([state, stack]);
        for (let i = 0; i < dst.length; ++i)
        {
            const thisPair = dst[i];
            const thisState = thisPair[0];
            const thisStack = thisPair[1];
            const transitions = this.getOutgoingTransitions(thisState);
            for (const transition of transitions)
            {
                const readSymbol = transition[READ_SYMBOL_INDEX];
                const popSymbol = transition[POP_SYMBOL_INDEX];
                const pushSymbol = transition[PUSH_SYMBOL_INDEX];

                if (readSymbol === EMPTY_SYMBOL &&
                    (popSymbol === thisStack[thisStack.length - 1] ||
                        popSymbol === EMPTY_SYMBOL))
                {
                    const newStack = thisStack.slice();
                    const toState = transition[TO_STATE_INDEX];
                    if (popSymbol !== EMPTY_SYMBOL) newStack.pop();
                    if (pushSymbol !== EMPTY_SYMBOL) newStack.push(pushSymbol);

                    //Checks if dst includes the new destination and stack pair
                    let flag = false;
                    for (const pair of dst)
                    {
                        if (pair[0] === toState)
                        {
                            if (isEqualStack(pair[1], newStack))
                            {
                                flag = true;
                                break;
                            }
                        }
                    }
                    if (!flag) dst.push([toState, newStack]);
                }
            }
        }
        return dst;
    }

    getOutgoingTransitions(state, dst = [])
    {
        if (!state) return dst;
        if (!this._states.has(state.getStateID())) throw new Error('Unable to find source state with id \'' + state.getStateID() + '\'');

        const fromTransitionKey = state.getStateID() + '->';
        for (const key of this._transitions.keys())
        {
            if (key.startsWith(fromTransitionKey))
            {
                const transition = this._transitions.get(key);
                const symbols = transition.getSymbols();
                for (const symbol of symbols)
                {
                    dst.push([
                        state,
                        symbol.getReadSymbol(),
                        transition.getDestinationState(),
                        symbol.getPopSymbol(),
                        symbol.getPushSymbol()
                    ]);
                }
            }
        }

        return dst;
    }

    getHashCode()
    {
        let string = '';
        for (const state of this._states.values())
        {
            string += state.getHashString() + ',';
        }
        string += '|';
        for (const transition of this._transitions.values())
        {
            string += transition.getHashString() + ',';
        }
        string += '|';
        for (const state of this._finalStates)
        {
            string += state.getHashString();
        }
        string += '|';
        string += this._startState ? this._startState.getHashString() : '';
        return stringHash(string);
    }
}

function isEqualStack(stack1, stack2)
{
    const temp = [];
    for (const element of stack1)
    {
        temp.push(element);
    }
    for (const element of stack2)
    {
        const i = temp.indexOf(element);
        if (i === -1) return false;
        temp.splice(i, 1);
    }
    return temp.length <= 0;
}

export default PDA;
