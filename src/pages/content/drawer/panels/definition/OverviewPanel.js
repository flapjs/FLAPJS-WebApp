import React from 'react';
import * as Config from 'config.js';

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
        <GraphDefinition graph={this.props.graph} machineBuilder={this.props.machineBuilder}/>
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

    this.state = {
      customName: "",
      customNameIndex: -1
    };
  }

  saveCustomName(node)
  {
    const customLabel = this.state.customName;
    if (!this.props.graph.getNodeByLabel(customLabel))
    {
      node.label = customLabel;
    }
    else
    {
      //TODO: this is an invalid dupe name!
    }

    //Reset custom name
    this.setState({
      customName: node.label,
      custonNameIndex: -1
    });
  }

  render()
  {
    const graph = this.props.graph;
    const machine = this.props.machineBuilder.getMachine();
    return <div className="graphinfo">
      <div className="statblock">
        <label>Q :</label>
        <div className="statset">
        <span className="statset-open">{"{"}</span>
          <div className="statlist" id="states">
            {
              graph.nodes.map((e, i) => {
                return <span key={i}>
                  <input className="statinput" type="text"
                  onFocus={ev=>this.setState({customName: ev.target.value, customNameIndex: i})}
                  onChange={ev=>
                    this.setState({customName: ev.target.value})}
                  onKeyUp={ev=>{
                    if (ev.keyCode === Config.SUBMIT_KEY)
                    {
                      this.saveCustomName(e);
                      ev.target.blur();
                    }
                  }}
                  onBlur={ev=>this.saveCustomName(e)}
                  value={this.state.customNameIndex === i ? this.state.customName : e.label}/>
                    <span>,</span>
                  </span>;
              })
            }
            <button className="statinput-button" onClick={()=>{
              //TODO: make this into a function
              graph.newNode(0, 0, Config.STR_STATE_LABEL + (graph.nodes.length));
            }}>+</button>
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
