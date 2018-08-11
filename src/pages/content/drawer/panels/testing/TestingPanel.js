import React from 'react';
import '../Panel.css';
import './TestingPanel.css';

import TestingManager from 'builder/TestingManager.js';
import TestList from './components/TestList.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();

    this.state = {
      errorCheckMode: this.props.tester.getErrorCheckMode()
    };

    this.onChangeErrorCheckMode = this.onChangeErrorCheckMode.bind(this);
  }

  onChangeErrorCheckMode(e)
  {
    const value = e.target.value;
    const tester = this.props.tester;
    const machineBuilder = this.props.machineBuilder;
    tester.setErrorCheckMode(value);

    //HACK: this should automatically be updated by testing manager on set error check mode
    if (!tester.shouldCheckError)
    {
      machineBuilder.machineErrorChecker.clear();
    }
    else
    {
      machineBuilder.onGraphChange(machineBuilder.graph);
    }

    this.setState({errorCheckMode: value});
  }

  render()
  {
    const machineBuilder = this.props.machineBuilder;
    const tester = this.props.tester;

    return <div className="panel-container" id="testing" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>Testing</h1>
      </div>

      <TestList machineBuilder={machineBuilder} tester={tester}/>
      <hr />

      <div id="test-errorcheck">
        <label>Error Checking</label>
        <select className="panel-select"
          value={this.state.errorCheckMode}
          onChange={this.onChangeErrorCheckMode}>
          <option value={TestingManager.NO_ERROR_CHECK}>None</option>
          <option value={TestingManager.DELAYED_ERROR_CHECK}>Delayed</option>
          <option value={TestingManager.IMMEDIATE_ERROR_CHECK}>Immediate</option>
        </select>
      </div>
      <div>
        <input id="test-step" type="checkbox" disabled="true"/>
        <label htmlFor="test-step">Step-by-Step Mode</label>
      </div>
      <div>
        <input id="test-closure" type="checkbox" disabled="true"/>
        <label htmlFor="test-closure">Transition By Closure</label>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default TestingPanel;
