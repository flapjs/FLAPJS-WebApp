import React from 'react';
import Style from './TransitionChartView.css';

import { EMPTY_SYMBOL } from 'modules/fsa/machine/FSA.js';

class TransitionChartView extends React.Component
{
  constructor(props)
  {
    super(props);

    //NOTE: this only works if machine hashing is faster than a re-calculate
    this._cachedMachineHash = 0;
    this._cachedMachineComponents = [];
  }

  //Override
  componentWillUnmount()
  {
    //Reset cached components for re-rendering
    this._cachedMachineHash = 0;
    this._cachedMachineComponents.length = 0;
  }

  renderTransitionEntry(machine, state, symbol)
  {
    const deterministic = machine.isDeterministic();
    let error = false;
    let transitionString = "";
    let destinations = machine.doTransition(state, symbol);

    //DFA's can't have empty symbols
    if (deterministic && symbol === EMPTY_SYMBOL) error = true;

    if (destinations.length <= 0)
    {
      if (deterministic)
      {
        error = true;
        transitionString = "-";
      }
      else
      {
        //Don't show missing transitions for NFA's
        return null;
      }
    }
    else if (destinations.length === 1)
    {
      //Regardless if it's deterministic, it is a valid transition
      error = false;
      transitionString = destinations[0].getStateLabel();
    }
    else
    {
      //If it's deterministic, it is not valid
      if (deterministic) error = true;

      let string = "";
      for(const state of destinations)
      {
        if (string.length > 0) string += ", ";
        string += state.getStateLabel();
      }
      transitionString = "{" + string + "}";
    }

    return (
      <tr key={state.getStateID() + ":" + symbol}>
        <td className={Style.chart_key}>{"(" + state.getStateLabel() + ", " + symbol + ")"}</td>
        <td className={Style.chart_value + (error ? " error " : "")}>{transitionString}</td>
      </tr>
    );
  }

  renderTransitionTable(machine)
  {
    const machineHash = machine.getHashCode();
    if (machineHash !== this._cachedMachineHash)
    {
      this._cachedMachineHash = machineHash;
    }
    else
    {
      return this._cachedMachineComponents;
    }

    const result = this._cachedMachineComponents = [];
    const deterministic = machine.isDeterministic();

    for(const state of machine.getStates())
    {
      let entry = null;

      //The empty transitions...
      entry = this.renderTransitionEntry(machine, state, EMPTY_SYMBOL);
      if (entry) result.push(entry);

      //The other transitions...
      for(const symbol of machine.getAlphabet())
      {
        entry = this.renderTransitionEntry(machine, state, symbol);
        if (entry) result.push(entry);
      }
    }
    return result;
  }

  //Override
  render()
  {
    const machineController = this.props.machineController;
    const machine = machineController.getMachineBuilder().getMachine();
    const deterministic = machineController.getMachineType() === 'DFA';

    return (
      <div id={this.props.id}
        className={Style.chart_container +
        " " + this.props.className}
        style={this.props.style}>
        <table>
          <tbody>
            <tr>
              <th>
                {"Q\u00d7\u03A3"}
              </th>
              <th>
                {deterministic ? "Q" : "\u2118(Q)"}
              </th>
            </tr>
            {this.renderTransitionTable(machine)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TransitionChartView;
