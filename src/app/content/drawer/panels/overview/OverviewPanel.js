import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import Config from 'config.js';

import StatesList from './stateslist/StatesList.js';
import AlphabetList from './alphabetlist/AlphabetList.js';
import TransitionTable from './transitiontable/TransitionTable.js';
import TransitionFunction from './transitionfunction/TransitionFunction.js';
import FormalDefinition from "./formaldefinition/FormalDefinition";

import AutoLayout from "util/AutoLayout.js"

import DFA from 'machine/DFA.js';
import { convertToDFA } from 'machine/util/convertNFA.js';

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

  switchDefinition()
  {
    this.setState((prev, props) => {
      return { viewFormal: !prev.viewFormal };
    });
  }

  render()
  {
    const machineBuilder = this.props.machineBuilder;
    const viewFormal = this.state.viewFormal;

    return <div className="panel-container" id="overview" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>{I18N.toString("component.overview.title")}</h1>
      </div>
        <div className="panel-content">
          {viewFormal &&
            <FormalDefinition machineBuilder={machineBuilder}/>}

          {!viewFormal &&
            <div>
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
                <TransitionFunction machineBuilder={machineBuilder}/>
                <TransitionTable machineBuilder={machineBuilder}/>
              </div>
            </div>}

          <hr/>

          <button className="panel-button" onClick={(e) => {
            const result = convertToDFA(this.props.machineBuilder.getMachine(), new DFA());
            console.log(result);
          }}>
            {I18N.toString("action.overview.convertmachine")}
          </button>
          <button className="panel-button" onClick = {() => {
            AutoLayout.applyLayout(machineBuilder.graph)
          }}>
            AutoLayout
          </button>
          <button className="panel-button" onClick={this.switchDefinition}>
            {viewFormal ? "View Defintion" : "View Formal Definition"}
          </button>
          <div className="panel-checkbox">
            <input type="checkbox" id="auto-statename" onChange={(e) => {
              machineBuilder.setAutoRenameNodes(e.target.checked);
            }} checked={machineBuilder.shouldAutoRenameNodes()}/>
            <label htmlFor="auto-statename">{I18N.toString("options.autolabel")}</label>
          </div>
        </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OverviewPanel;
