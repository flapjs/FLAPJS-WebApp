import React from 'react';
import Style from './TransitionTableView.css';

import { EMPTY_SYMBOL } from 'modules/fsa/machine/FSA.js';

const SYMBOL_AXIS = "symbols";
const STATE_AXIS = "states";

class TransitionTableView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      rowAxis: SYMBOL_AXIS
    };

    this.onRowAxisSwitch = this.onRowAxisSwitch.bind(this);
  }

  onRowAxisSwitch(e)
  {
    this.setState((prev, props) => {
      return {
        rowAxis: prev.rowAxis === SYMBOL_AXIS ? STATE_AXIS : SYMBOL_AXIS
      };
    });
  }

  renderTableEntries(machine, rowAxis)
  {
    const result = [];
    for(const state of machine.getStates())
    {
      const rowComponents = [];
      switch(rowAxis)
      {
        case SYMBOL_AXIS:
          for(const symbol of machine.getAlphabet())
          {
            const destinations = machine.doTransition(state, symbol);
            let transitionString = "";

            if (destinations.length <= 0)
            {
              transitionString = "-";
            }
            else if (destinations.length === 1)
            {
              transitionString = destinations[0].getStateLabel();
            }
            else
            {
              let string = "";
              for(const other of destinations)
              {
                if (string.length > 0) string += ", ";
                string += state.getStateLabel();
              }
              transitionString = "{" + string + "}";
            }

            rowComponents.push(
              <td key={state.getStateID() + ":" + symbol}>
                {transitionString}
              </td>
            );
          }
        break;
        case STATE_AXIS:
          for(const other of machine.getStates())
          {
            const symbols = machine.getTransitionSymbols(state, other);
            rowComponents.push(
              <td key={state.getStateID() + ":" + other.getStateID()}>
                {symbols ? symbols : "-"}
              </td>
            );
          }
        break;
        default:
          throw new Error("Unknown row axis type \'" + rowAxis + "\'");
      }
      result.push(
        <tr key={state.getStateID()}>
          <th scope="row" className={Style.table_axis_header + " row"}>
            {state.getStateLabel()}
          </th>
          {rowComponents}
        </tr>
      );
    }
    return result;
  }

  renderTableAxis(machine, rowAxis)
  {
    let result = [];
    switch(rowAxis)
    {
      case SYMBOL_AXIS:
        for(const symbol of machine.getAlphabet())
        {
          result.push(
            <th key={symbol} scope="col" className={Style.table_axis_header + " col"}>
              {symbol}
            </th>
          );
        }
        if (!machine.isDeterministic())
        {
          result.push(
            <th key={EMPTY_SYMBOL} scope="col" className={Style.table_axis_header + " col"}>
              {EMPTY_SYMBOL}
            </th>
          );
        }
        return result;
      case STATE_AXIS:
        for(const state of machine.getStates())
        {
          result.push(
            <th key={state.getStateID()} scope="col" className={Style.table_axis_header + " col"}>
              {state.getStateLabel()}
            </th>
          );
        }
        return result;
      default:
        throw new Error("Unknown row axis type \'" + rowAxis + "\'");
    }
  }

  //Override
  render()
  {
    const rowAxis = this.state.rowAxis;
    const machineController = this.props.machineController;
    const machine = machineController.getMachineBuilder().getMachine();

    return (
      <div id={this.props.id}
        className={Style.table_container +
          " " + this.props.className}
        style={this.props.style}>
        <table>
          <tbody>
            <tr>
              <th>
                <button onClick={this.onRowAxisSwitch}>
                  {rowAxis === SYMBOL_AXIS ? "Q/\u03A3" : "Q/Q"}
                </button>
              </th>
              {this.renderTableAxis(machine, rowAxis)}
            </tr>
            {this.renderTableEntries(machine, rowAxis)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TransitionTableView;
