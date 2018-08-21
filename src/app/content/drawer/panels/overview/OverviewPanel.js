import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import Config from 'config.js';

import StatesList from './stateslist/StatesList.js';
import AlphabetList from './alphabetlist/AlphabetList.js';
import TransitionTable from './transitiontable/TransitionTable.js';
import TransitionFunction from './transitionfunction/TransitionFunction.js';
import FormalDefinition from "./formaldefinition/FormalDefinition";

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();

    this.state = {
      machineType: this.props.machineBuilder.getMachineType(),
      viewFormal: false
    };

    this.onChangeMachineType = this.onChangeMachineType.bind(this);
    this.switchDefinition = this.switchDefinition.bind(this);
  }

  onChangeMachineType(e)
  {
    const value = e.target.value;
    this.props.machineBuilder.setMachineType(value);
    this.setState({machineType: value});
  }

  switchDefinition() {
    this.setState({viewFormal: !this.state.viewFormal});
  }

  render()
  {
    const machineBuilder = this.props.machineBuilder;
    return <div className="panel-container" id="overview" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>{I18N.toString("component.overview.title")}</h1>
        <button onClick={this.switchDefinition}>{this.state.viewFormal ? "Close Formal Def" : "View Formal Def"}</button>
      </div>
      {
        this.state.viewFormal ? <FormalDefinition/> :
        <div className="panel-content">
          <select className="machine-type panel-select"
                  value={this.state.machineType}
                  onChange={this.onChangeMachineType}>
            <option value="DFA">DFA</option>
            <option value="NFA">NFA</option>
          </select>
          <div className="graphinfo-important">
            <StatesList machineBuilder={machineBuilder} controller={this.props.controller}/>
            <AlphabetList machineBuilder={machineBuilder}/>
          </div>
          <div className="graphinfo">
            <TransitionTable machineBuilder={machineBuilder}/>
            <TransitionFunction machineBuilder={machineBuilder}/>
          </div>

          <hr/>

          <button disabled="true" className="panel-button">{I18N.toString("action.overview.convertmachine")}</button>
          <div className="panel-checkbox">
            <input type="checkbox" id="auto-statename" onChange={(e) => {
              machineBuilder.setAutoRenameNodes(e.target.checked);
            }} checked={machineBuilder.shouldAutoRenameNodes()}/>
            <label htmlFor="auto-statename">{I18N.toString("options.autolabel")}</label>
          </div>
        </div>
      }

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OverviewPanel;
