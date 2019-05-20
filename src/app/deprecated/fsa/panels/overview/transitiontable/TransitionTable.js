import React from 'react';
import './TransitionTable.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import { EMPTY } from 'deprecated/fsa/machine/Symbols.js';

const SRC = 0;
const SYMBOL = 1;
const DST = 2;

const SYMBOL_AXIS = 'symbols';
const STATE_AXIS = 'states';

class TransitionTable extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            rowAxis: SYMBOL_AXIS
        };
    }

    render()
    {
        const machineController = this.props.machineController;
        const machine = machineController.getMachineBuilder().getMachine();
        const states = machineController.getStates();
        const alphabet = machineController.getAlphabet();
        // const transitions = machineController.getTransitions();
        const rowAxisType = this.state.rowAxis;
        const isNFAMachine = machineController.getMachineType() == 'NFA';
        const hasEmptyColumn = rowAxisType === SYMBOL_AXIS && isNFAMachine;

        return <InfoBlock title={I18N.toString('component.transitiontable.title')}>
            <div className="transitiontable-container">
                <table className="transitiontable">
                    <tbody>
                        <tr>
                            <th className="emptycell">
                                <button className="panel-button" onClick={()=>
                                    this.setState((prev, props)=>
                                    {
                                        return {
                                            rowAxis: prev.rowAxis == SYMBOL_AXIS ? STATE_AXIS : SYMBOL_AXIS
                                        };
                                    })}>
                                    {this.state.rowAxis == SYMBOL_AXIS ? 'Q/\u03A3' : 'Q/Q'}
                                </button>
                            </th>
                            {
                                rowAxisType === SYMBOL_AXIS ?
                                    alphabet.map((e, i)=><th key={e} scope="col" className="col">{e}</th>) :
                                    rowAxisType === STATE_AXIS ?
                                        states.map((e, i)=><th key={e} scope="col" className="col">{e}</th>) :
                                        null
                            }
                            {
                                hasEmptyColumn &&
                  <th scope="col">{EMPTY}</th>
                            }
                        </tr>
                        {
                            states.map((e, i)=><tr key={e}>
                                <th scope="row" className="row">{e}</th>
                                {
                                    rowAxisType === SYMBOL_AXIS ?
                                        alphabet.map((symbol, i) => 
                                        {
                                            let className = '';//TODO: machine.isFinalState(e) ? "accept" : "";
                                            const result = getDestinationFromSourceAndSymbol(machine, e, symbol, isNFAMachine);
                                            if (!isNFAMachine && (result.startsWith('{') || result == '-'))
                                            {
                                                className += ' error';
                                            }
                                            return <td key={e + ',' + symbol} className={className}>
                                                {result}
                                            </td>;
                                        }) :
                                        rowAxisType === STATE_AXIS ?
                                            states.map((dst, i) => 
                                            {
                                                const result = getSymbolFromSourceAndDestination(machine, e, dst);
                                                return <td key={e + ',' + dst}>
                                                    {result}
                                                </td>;
                                            }) :
                                            null
                                }
                                {
                                    hasEmptyColumn &&
                    <td>{getDestinationFromSourceAndSymbol(machine, e, EMPTY)}</td>
                                }
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </InfoBlock>;
    }
}

function getDestinationFromSourceAndSymbol(machine, src, symbol, isSet=true)
{
    const result = machine.doTransition(src, symbol);

    //Assumes that the machine is always an NFA, therefore the result is an array
    if (Array.isArray(result))
    {
        return !isSet && result.length == 1 ?
            result[0] :
            result.length > 0 ?
                '{' + result.join(', ') + '}' : '-';
    }
    else
    {
        return result || '-';
    }
}

function getSymbolFromSourceAndDestination(machine, src, dst)
{
    const result = [];
    const transitions = machine.getTransitions();
    for(const transition of transitions)
    {
        if (transition[SRC] == src && transition[DST] == dst)
        {
            result.push(transition[SYMBOL]);
        }
    }

    if (result.length === 1)
    {
        return result[0];
    }
    else if (result.length > 0)
    {
        return '{' + result.join(', ') + '}';
    }
    else
    {
        return '-';
    }
}

export default TransitionTable;
