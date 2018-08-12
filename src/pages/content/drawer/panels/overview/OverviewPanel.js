import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import Config from 'config.js';

import StateList from './statelist/StateList.js';
import AlphabetList from './alphabetlist/AlphabetList.js';
import TransitionTable from './transitiontable/TransitionTable.js';

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();

    this.state = {
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
    const machineBuilder = this.props.machineBuilder;
    return <div className="panel-container" id="overview" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>Definition</h1>
      </div>
      <div className="panel-content">
        <select className="machine-type panel-select"
          value={this.state.machineType}
          onChange={this.onChangeMachineType}>
          <option value="DFA">DFA</option>
          <option value="NFA">NFA</option>
        </select>
        <div className="graphinfo-important">
          <StateList machineBuilder={machineBuilder} controller={this.props.controller}/>
          <AlphabetList machineBuilder={machineBuilder}/>
        </div>
        <div className="graphinfo">
          <TransitionTable machineBuilder={machineBuilder}/>
        </div>

        <hr />

        <button disabled="true" className="panel-button">Convert To...</button>
        <div>
          <input type="checkbox" id="auto-statename" onChange={(e) => {
            machineBuilder.setAutoRenameNodes(e.target.checked);
          }} checked={machineBuilder.shouldAutoRenameNodes()}/>
          <label htmlFor="auto-statename">Automatic State Labels</label>
        </div>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OverviewPanel;
