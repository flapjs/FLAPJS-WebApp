import React from 'react';

import '../Panel.css';
import './TestingPanel.css';

class TestingPanel extends React.Component
{
  render()
  {
    return <div className="panel-container" id="testing">
      <h1>Testing</h1>
      <hr />
      <button className="panel-button test-import">Import Test</button>
      <TestInputList />
      <button className="panel-button test-run">Run All Tests</button>
      <hr />
      <div>
        <input id="test-step" type="checkbox"/>
        <label htmlFor="test-step">Simulate Step-by-step</label>
      </div>
      <div>
        <input id="test-closure" type="checkbox"/>
        <label htmlFor="test-closure">Transition By Closure</label>
      </div>
    </div>;
  }
}

class TestInputList extends React.Component
{
  constructor(props)
  {
    super(props);

    this.inputs = [];

    this.inputs.push("0101010001001");
    this.inputs.push("1*0*");
    this.inputs.push("001011");
    this.inputs.push("1");
    this.inputs.push("1*0*U1*01*");
    this.inputs.push("E*");
  }

  render()
  {
    return <div className="test-inputlist">
      { this.inputs.map((e, i) =>
        <TestInput key={i} value={e}/>) }
      <button className="test-inputlist-new">New Test</button>
      <button className="test-inputlist-clear">Clear</button>
    </div>;
  }
}

class TestInput extends React.Component
{
  render()
  {
    return <div className="test-input">
      <button className="test-input-result">(x)</button>
      <input className="test-input-label" contentEditable="true" defaultValue={this.props.value}/>
      <button className="test-input-delete">(-)</button>
    </div>;
  }
}

export default TestingPanel;
