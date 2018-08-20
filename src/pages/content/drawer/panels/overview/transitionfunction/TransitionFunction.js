import React from 'react';
import './TransitionFunction.css';

import InfoBlock from '../infoblock/InfoBlock';

class TransitionFunction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const machineBuilder = this.props.machineBuilder;
    const machine = machineBuilder.getMachine();
    const states = machine.getStates();
    const alphabet = machine.getAlphabet();
    let isNFA = machineBuilder.getMachineType() == "NFA";
    return(
        <InfoBlock title="Transition Function">
          <div className="transitionfunction-container">
            <table className="transitionfunction-table">
              <tbody>
                <tr>
                  <th>Q&#10005;&Sigma;</th>
                  <th>{isNFA ? "\u2118(Q)" : "Q"}</th>
                </tr>
                {states.map((state, i) => {
                  alphabet.map((symbol, j) => <tr>
                      <td>{"("+state+","+symbol+")"}</td>
                    </tr>
                  )})}
              </tbody>
            </table>
          </div>
        </InfoBlock>
    );
  }
}

export default TransitionFunction;