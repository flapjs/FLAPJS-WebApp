import React from 'react';
import '../Panel.css';
import './TestingPanel.css';

import TestList from './components/TestList.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();
  }

  render()
  {
    return <div className="panel-container" id="testing" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>Testing</h1>
      </div>

      <TestList tester={this.props.tester}/>
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

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default TestingPanel;
