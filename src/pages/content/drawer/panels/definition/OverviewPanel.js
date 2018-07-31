import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import * as Config from 'config.js';

import SetEditor from 'pages/content/components/SetEditor.js';

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      autoNameStates: true,
      machineType: this.props.machineBuilder.getMachineType()
    };

    this.onChangeMachineType = this.onChangeMachineType.bind(this);
  }

  onChangeMachineType(e)
  {
    const value = e.target.value;
    this.props.machineBuilder.setMachineType(value);
    this.setState({machineType: value});
  }

  render()
  {
    return <div className="panel-container" id="overview">
      <div className="panel-title">
        <h1>Definition</h1>

        <select className="machine-type"
          value={this.state.machineType}
          onChange={this.onChangeMachineType}>
          <option value="DFA">DFA</option>
          <option value="NFA">NFA</option>
        </select>

      </div>
      <div className="panel-content">
        <GraphDefinition graph={this.props.graph} machineBuilder={this.props.machineBuilder}/>
      </div>
      <hr />
      <button disabled="true" className="panel-button">Convert To...</button>
      <div>
        <input type="checkbox" id="auto-statename" onChange={(e) => {
          const checked = e.target.checked;
          this.setState({autoNameStates: checked}, () => {
            this.props.machineBuilder.shouldAutomaticallyRenameNodes = checked;
          });
        }} checked={this.state.autoNameStates}/>
        <label htmlFor="auto-statename">Automatic State Labels</label>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

class GraphDefinition extends React.Component
{
  constructor(props)
  {
    super(props);

    this.stateSet = React.createRef();
    this.alphabetSet = React.createRef();

    this.onMarkDirty = this.onMarkDirty.bind(this);
  }

  onMarkDirty()
  {
    this.stateSet.updateValues(true);
    this.alphabetSet.updateValues();
  }

  componentWillMount()
  {
    this.props.graph.on("markDirty", this.onMarkDirty);
  }

  componentWillUnmount()
  {
    this.props.graph.removeListener("markDirty", this.onMarkDirty);
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
          <SetEditor ref={ref=>this.stateSet=ref}
            src={graph.nodes}
            getElementID={e=>e.label}
            onAdd={id=>graph.newNode(0, 0, id)}
            onRemove={e=>graph.deleteNode(e)}
            onRename={(e, id)=>e.setCustomLabel(id)}/>
        <span className="statset-close">{"}"}</span>
        </div>
      </div>
        <div className="statblock">
          <label>&Sigma; :</label>
          <div className="statset">
          <span className="statset-open">{"{"}</span>
            <AlphabetSet ref={ref=>this.alphabetSet=ref}
              graph={graph}
              machineBuilder={this.props.machineBuilder}/>
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

class StateSet extends React.Component
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
    if (customLabel && !this.props.graph.getNodeByLabel(customLabel))
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
    return <div className="statlist" id="states">
      {
        graph.nodes.map((e, i) => {
          return <span key={i}>
            <input className="statinput" type="text"
            onFocus={ev=>{
              this.setState({customName: ev.target.value, customNameIndex: i});
              ev.target.select();
            }}
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
    </div>;
  }
}

class AlphabetSet extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      value: this.props.machineBuilder.getMachine().getAlphabet().join(", ")
    }

    this.onValueChange = this.onValueChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  updateValues()
  {
    this.setState({value: this.props.machineBuilder.getMachine().getAlphabet().join(", ")});
  }

  onFocus()
  {
    this.updateValues();
  }

  onBlur(e)
  {
    const usedAlphabet = this.props.machineBuilder.getMachine().getUsedAlphabet();
    const values = this.state.value.split(", ");
    const result = [];
    for(const symbol of values)
    {
      if (!usedAlphabet.includes(symbol))
      {
        result.push(symbol);
      }
    }

    //HACK: should not replace the entire array with a new one, should just alter it
    this.props.machineBuilder._symbols = result;
    this.setState({value: values.join(", ")});
  }

  onKeyUp(e)
  {
    if (e.keyCode === Config.SUBMIT_KEY)
    {
      e.target.blur();
    }
    else if (e.keyCode === Config.CLEAR_KEY)
    {
      const target = e.target;
      this.setState({value: this.props.machineBuilder.getMachine().getUsedAlphabet().join(", ")}, () => target.blur());
    }
  }

  onKeyDown(e)
  {
    if (e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY)
    {
      e.preventDefault();
    }
  }

  onValueChange(e)
  {
    const usedAlphabet = this.props.machineBuilder.getMachine().getUsedAlphabet();
    const value = e.target.value.trim();

    const result = new Set();
    for(let v of value)
    {
      if (usedAlphabet.includes(v))
      {
        result.add(v);
      }
      else if (v === ' ' || v === ',')
      {
        continue;
      }
      else
      {
        result.add(v);
      }
    }

    const prevStart = e.target.selectionStart;
    const prevEnd = e.target.selectionEnd;
    this.setState({value: Array.from(result).join(", ")});
    e.target.setSelectionRange(prevStart, prevEnd);
  }

  render()
  {
    const graph = this.props.graph;
    const machine = this.props.machineBuilder.getMachine();
    return <span className="setedit-container">
      <input className="setedit-input" type="text" value={this.state.value}
        spellCheck="false"
        onChange={this.onValueChange}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onFocus={this.onFocus}
        onBlur={this.onBlur}/>
    </span>;
  }
}

export default OverviewPanel;
