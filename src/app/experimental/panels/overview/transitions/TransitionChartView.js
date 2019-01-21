import React from 'react';
import Style from './TransitionChartView.css';

//TODO: Outdated; this should be from FSA instead of symbols
import { EMPTY } from 'machine/Symbols.js';

class TransitionChartView extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  renderTransitionRow()
  {

  }

  renderTransitionTable(machine, deterministic)
  {
    const result = [];
    const states = machine.getStates();
    const alphabet = machine.getAlphabet();
    for(const state of states)
    {
      const emptyTransitions = machine.doTransition(state, EMPTY);
      for(const symbol of alphabet)
      {
        let transition = machine.doTransition(state, symbol);
        if (!deterministic && !transition.length) return;
        if (deterministic && !transition.length)
        {

        }
        if (deterministic && transition.length > 1)
        {

        }
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
            {this.renderTransitionTable(machine, deterministic)}
            <tr>
              <td>WHAT</td>
              <td>NOTHING</td>
            </tr>
            <tr>
              <td>WHAT</td>
              <td>NOTHING</td>
            </tr>
            <tr>
              <td>WHAT</td>
              <td>NOTHING</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TransitionChartView;
