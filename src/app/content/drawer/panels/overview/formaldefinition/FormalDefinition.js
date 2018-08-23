import React from 'react';
import './FormalDefinition.css';

class FormalDefinition extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const machineBuilder = this.props.machineBuilder;
    const machine = machineBuilder.getMachine();
    const states = machine.getStates();
    const finalStates = machine.getFinalStates();
    const alphabet = machine.getAlphabet().sort();
    let isNFA = machineBuilder.getMachineType() == "NFA";
    return <div className="formaldef-container">
      <h2>{"M = (Q, \u03A3, \u03b4, q0, F)"}</h2>
      <hr/>
      <div>
        <h3>Q</h3>
        <span className="formaldef-values">
          {"{" + states.join(", ") + "}"}
        </span>
      </div>
      <div>
        <h3>&Sigma;</h3>
        <span className="formaldef-values">
          {"{" + alphabet.join(", ") + "}"}
        </span>
      </div>
      <div>
        <h3>{"\u03b4"}</h3>
        <div className="formaldef-values">
        {
          states.map((state, i) => {
            return alphabet.map((symbol, j) => {
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
              return <div key={""+state+symbol} className={className}>
                    {"(" + state + "," + symbol + ")" + " \u2192 " + trans}
              </div>
            })
          })
        }
        </div>
      </div>
      <div>
        <h3>q0</h3>
        <span className="formaldef-values">
          {states[0]}
        </span>
      </div>
      <div>
        <h3>F</h3>
        <span className="formaldef-values">
          {"{" + finalStates.join(",") + "}"}
        </span>
      </div>
    </div>;
  }
}

export default FormalDefinition;
