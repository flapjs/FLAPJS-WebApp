import React from 'react';

import '../Panel.css';
import './TestingPanel.css';

import TestingInputList from './TestingInputList.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className="panel-container" id="testing">
      <div className="panel-title">
        <h1>Testing</h1>
      </div>

      <TestingInputList tester={this.props.tester}/>
      <hr />

      <div>
        <input id="test-errorcheck" type="checkbox"
          checked={this.props.tester.autoErrorCheck}
          onChange={(e)=>{
            this.props.tester.autoErrorCheck = e.target.checked;
          }}/>
        <label htmlFor="test-errorcheck">Automatically Check Errors</label>
      </div>
      <div>
        <input id="test-step" type="checkbox" disabled="true"/>
        <label htmlFor="test-step">Step-by-Step Mode</label>
      </div>
      <div>
        <input id="test-closure" type="checkbox" disabled="true"/>
        <label htmlFor="test-closure">Transition By Closure</label>
      </div>
    </div>;
  }
}

export default TestingPanel;
