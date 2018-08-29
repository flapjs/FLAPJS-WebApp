import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import Config from 'config.js';

import StatesList from './stateslist/StatesList.js';
import AlphabetList from './alphabetlist/AlphabetList.js';
import TransitionTable from './transitiontable/TransitionTable.js';
import TransitionFunction from './transitionfunction/TransitionFunction.js';
import FormalDefinition from "./formaldefinition/FormalDefinition";

import GraphLayout from "graph/GraphLayout.js"

import DFA from 'machine/DFA.js';
import { convertToDFA } from 'machine/util/convertNFA.js';

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = null;

    this.state = {
      viewFormal: false
    };

    this.onChangeMachineType = this.onChangeMachineType.bind(this);
    this.onConvertToDFA = this.onConvertToDFA.bind(this);
    this.onConvertToNFA = this.onConvertToNFA.bind(this);
    this.onAutoLayout = this.onAutoLayout.bind(this);
    this.onChangeAutoRename = this.onChangeAutoRename.bind(this);

    this.switchDefinition = this.switchDefinition.bind(this);
  }

  onConvertToDFA(e)
  {
    const graph = this.props.graphController.getGraph();
    const machineBuilder = this.props.machineController.getMachineBuilder();
    const result = convertToDFA(machineBuilder.getMachine(), new DFA());
    graph.copyMachine(result);
    machineBuilder.setMachineType("DFA");
  }

  onConvertToNFA(e)
  {
    const machineBuilder = this.props.machineController.getMachineBuilder();
    machineBuilder.setMachineType("NFA");
  }

  onAutoLayout(e)
  {
    GraphLayout.applyLayout(this.props.graphController.getGraph());
  }

  onChangeAutoRename(e)
  {
    const machineBuilder = this.props.machineController.getMachineBuilder();
    machineBuilder.setAutoRenameNodes(e.target.checked);
  }

  onChangeMachineType(e)
  {
    const value = e.target.value;
    const machineBuilder = this.props.machineController.getMachineBuilder();
    machineBuilder.setMachineType(value);
  }

  switchDefinition()
  {
    this.setState((prev, props) => {
      return { viewFormal: !prev.viewFormal };
    });
  }

  render()
  {
    const graphController = this.props.graphController;
    const machineController = this.props.machineController;

    const graph = graphController.getGraph();
    const machineBuilder = machineController.getMachineBuilder();

    return <div className="panel-container" id="overview" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>{I18N.toString("component.overview.title")}</h1>
      </div>
        <div className="panel-content">
          {this.state.viewFormal &&
            <FormalDefinition machineBuilder={machineBuilder}/>}

          {!this.state.viewFormal &&
            <div>
              <select className="machine-type panel-select"
                value={machineBuilder.getMachineType()}
                onChange={this.onChangeMachineType}>
                <option value="DFA">DFA</option>
                <option value="NFA">NFA</option>
              </select>
              <div className="graphinfo-important">
                <StatesList machineBuilder={machineBuilder} graphController={graphController}/>
                <AlphabetList machineBuilder={machineBuilder}/>
              </div>
              <div className="graphinfo">
                <TransitionFunction machineBuilder={machineBuilder}/>
                <TransitionTable machineBuilder={machineBuilder}/>
              </div>
            </div>}

          <hr/>
          {
            machineBuilder.getMachineType() == "DFA" ?
              <button className="panel-button" onClick={this.onConvertToNFA}>
                {I18N.toString("action.overview.convertnfa")}
              </button>
            : machineBuilder.getMachineType() == "NFA" ?
              <button className="panel-button" onClick={this.onConvertToDFA}>
                {I18N.toString("action.overview.convertdfa")}
              </button>
            : null
          }
          <button className="panel-button" onClick={this.onAutoLayout}>
            {I18N.toString("action.overview.autolayout")}
          </button>
          <button className="panel-button" onClick={this.switchDefinition}>
            {this.state.viewFormal ? "View Defintion" : "View Formal Definition"}
          </button>
          <div className="panel-checkbox">
            <input type="checkbox" id="auto-statename"
              onChange={this.onChangeAutoRename}
              checked={machineBuilder.shouldAutoRenameNodes()}/>
            <label htmlFor="auto-statename">{I18N.toString("options.autolabel")}</label>
          </div>
        </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OverviewPanel;
