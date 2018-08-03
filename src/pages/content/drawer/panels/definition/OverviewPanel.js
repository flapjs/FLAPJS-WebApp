import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import * as Config from 'config.js';

import StateList from './StateList.js';

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();

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
    return <div className="panel-container" id="overview" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>Definition</h1>
      </div>
      <div className="panel-content">
        <select className="machine-type"
          value={this.state.machineType}
          onChange={this.onChangeMachineType}>
          <option value="DFA">DFA</option>
          <option value="NFA">NFA</option>
        </select>
        <div className="graphinfo-important">
          <StateList machine={this.props.machineBuilder}/>
        </div>
        <div className="graphinfo">
          <div>
          </div>
        </div>
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

export default OverviewPanel;
