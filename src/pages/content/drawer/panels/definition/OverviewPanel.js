import React from 'react';

import '../Panel.css';
import './OverviewPanel.css';

class OverviewPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="overview">
      <div className="panel-title">
        <h1>Definition</h1>
      </div>
      <div className="panel-content">
        <GraphDefinition machineBuilder={this.props.machineBuilder}/>
      </div>
      <hr />
      <button className="panel-button">Convert To NFA</button>
      <div>
        <input type="checkbox"/>
        <label>Auto-Layout</label>
      </div>
    </div>;
  }
}

class GraphDefinition extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const machine = this.props.machineBuilder.getMachine();
    return <div className="graphinfo">
      <div className="statblock">
        <label>Q :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="states">
            {
              machine.getStates().join(", ")
            }
          </div>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
        <div className="statblock">
          <label>&Sigma; :</label>
          <div className="statset">
          <span className="statset-open">{"{"}</span>
            <div className="statlist" id="symbols">
              {
                machine.getAlphabet().join(", ")
              }
            </div>
          <span className="statset-close">{"}"}</span>
          </div>
        </div>
      <div className="statblock">
        <label>&delta; :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="transitions">
            {
              machine.getTransitions().map((e, i) => {
                return <li key={i}>({e[0]}, {e[1]}) &rarr; {e[2]},</li>;
              })
            }
          </div>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
      <div className="statblock">
        <label>q<sub>0</sub> :</label>
        <div className="statlist" id="startState">
          {
            machine.getStartState()
          }
        </div>
      </div>
      <div className="statblock">
        <label>F :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="finalStates">
            {
              machine.getFinalStates().join(", ")
            }
          </div>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
    </div>;
  }
}


export default OverviewPanel;
