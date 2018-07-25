import React from 'react';

import '../Panel.css';
import './TestingPanel.css';

import TestInputElement from './TestInputElement.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.testInputList = React.createRef();
  }

  render()
  {
    const graph = this.props.graph;
    return <div className="panel-container" id="testing">
      <div className="panel-title">
        <h1>Testing</h1>
      </div>
      <button className="panel-button test-import">Import Test</button>
      <TestInputList graph={graph} ref={ref=>this.testInputList=ref}/>
      <button className="panel-button test-run"
        onClick={()=>{
          //TODO: test all
        }}>
        Run All Tests
        </button>
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

    this.placeholderInput = React.createRef();

    this.state = {
      inputs: TestInputList.INPUTS
    };
  }

  addTestInput(inputString)
  {
    this.state.inputs.push(inputString);
  }

  render()
  {
    const graph = this.props.graph;

    return <div className="test-inputlist">
      { this.state.inputs.map((e, i) =>
        {
          if (!e) return null;
          return <TestInputElement key={i} graph={graph} value={e}
            onDelete={(e)=>{
              this.state.inputs.splice(i, 1);
            }}/>;
        }) }
      <TestInputElement ref={ref=>this.placeholderInput=ref} graph={graph} value="" placeholder={true}
        onAdd={(e) => {
          const value = e.getValue();
          if (value)
          {
            this.addTestInput(value);
          }

          this.placeholderInput.inputElement.focus();
          this.placeholderInput.inputElement.select();
        }}/>
      <button className="test-inputlist-clear"
        onClick={()=>{
          this.state.inputs.length = 0;
        }}>Clear</button>
    </div>;
  }
}
TestInputList.INPUTS = [];

export default TestingPanel;
