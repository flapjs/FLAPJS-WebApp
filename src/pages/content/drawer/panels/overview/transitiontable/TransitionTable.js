import React from 'react';
import './TransitionTable.css';

import InfoBlock from '../infoblock/InfoBlock.js';
import NFA from 'machine/NFA.js';
import { EMPTY } from 'machine/Symbols.js';

const SRC = 0;
const SYMBOL = 1;
const DST = 2;

const SYMBOL_AXIS = "symbols";
const STATE_AXIS = "states";

class TransitionTable extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      rowAxis: SYMBOL_AXIS
    }
  }

  render()
  {
    const machineBuilder = this.props.machineBuilder;
    const machine = machineBuilder.getMachine();
    const states = machine.getStates();
    const alphabet = machine.getAlphabet();
    const transitions = machine.getTransitions();
    const rowAxisType = this.state.rowAxis;
    const hasEmptyColumn = rowAxisType === SYMBOL_AXIS && machineBuilder.getMachineType() == "NFA";

    return <InfoBlock title="Transition Table">
      <div className="transitiontable-container">
        <table className="transitiontable">
          <tbody>
            <tr>
            <th className="emptycell">
              <button onClick={()=>
                this.setState((prev, props)=>{
                  return {
                    rowAxis: prev.rowAxis == SYMBOL_AXIS ? STATE_AXIS : SYMBOL_AXIS
                  };
                })}>
                Swap
              </button>
            </th>
            {
              rowAxisType === SYMBOL_AXIS ?
                alphabet.map((e, i)=><th key={e} scope="col">{e}</th>) :
              rowAxisType === STATE_AXIS ?
                states.map((e, i)=><th key={e} scope="col">{e}</th>) :
              null
            }
            {
              hasEmptyColumn &&
                <th scope="col">{EMPTY}</th>
            }
            </tr>
            {
              states.map((e, i)=><tr key={e}>
                <th scope="row">{e}</th>
                {
                  rowAxisType === SYMBOL_AXIS ?
                    alphabet.map((symbol, i)=><td key={e + "," + symbol}>{getDestinationFromSourceAndSymbol(machine, e, symbol)}</td>) :
                  rowAxisType === STATE_AXIS ?
                    states.map((dst, i)=><td key={e + "," + dst}>{getSymbolFromSourceAndDestination(machine, e, dst)}</td>) :
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

function getDestinationFromSourceAndSymbol(machine, src, symbol)
{
  const result = machine.doTransition(src, symbol);
  if (Array.isArray(result))
  {
    return result.length === 1 ? result : result.length > 0 ? "{" + result.join(", ") + "}" : "-";
  }
  else
  {
    return result || "-";
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
    return "{" + result.join(", ") + "}";
  }
  else
  {
    return "-";
  }
}

export default TransitionTable;
