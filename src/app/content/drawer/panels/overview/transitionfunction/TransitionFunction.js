import React from 'react';
import './TransitionFunction.css';

import InfoBlock from '../infoblock/InfoBlock';
import {EMPTY} from "../../../../../machine/Symbols";

class TransitionFunction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const machineBuilder = this.props.machineBuilder;
    const machine = machineBuilder.getMachine();
    const states = machine.getStates();
    const alphabet = machine.getAlphabet().sort();
    let isNFA = machineBuilder.getMachineType() == "NFA";
    return(
        <InfoBlock title="Transition Chart">
          <div className="transitionfunction-container">
            <table className="transitionfunction-table">
              <tbody>
                <tr>
                  <th>Q{"\u00d7"}&Sigma;</th>
                  <th>{isNFA ? "\u2118(Q)" : "Q"}</th>
                </tr>
                {
                  states.map((state, i) => {
                    let emptrans = machine.doTransition(state, EMPTY);
                    let empclassName = "";

                    let transitions = alphabet.map((symbol, j) => {
                      let className = "";
                      let trans = machine.doTransition(state, symbol);
                      if(isNFA && !trans.length) return;
                      if(!isNFA && !trans.length) {
                        className = "error";
                        trans = "-";
                      }
                      if(!isNFA && trans.length > 1) {
                        className = "error";
                        trans = "{" + trans + "}"
                      }
                      trans = isNFA ? "{" + trans + "}" : "" + trans;
                      return <tr key={""+state+symbol}>
                          <td className="transitionfunction-key">{"(" + state + "," + symbol + ")"}</td>
                          <td className={"transitionfunction-value " + className}>{trans}</td>
                        </tr>
                    });

                    if(emptrans.length > 0) {
                      if(!isNFA) {
                        empclassName = "error";
                      }
                      const addBrac = isNFA || emptrans.length > 1;
                      emptrans = addBrac ? "{" + emptrans + "}" : "" + emptrans;
                      transitions.unshift(
                          <tr key={""+state+EMPTY}>
                            <td className={"transitionfunction-key " + empclassName}>{"(" + state + "," + EMPTY + ")"}</td>
                            <td className="transitionfunction-value">{emptrans}</td>
                          </tr>
                      );
                    }
                    return transitions;
                  })
                }
              </tbody>
            </table>
          </div>
        </InfoBlock>
    );
  }
}

export default TransitionFunction;
