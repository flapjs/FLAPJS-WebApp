import React from 'react';
import './TestingInputList.css';

import TestingInput from './TestingInput.js';

class TestingInputList extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    const tester = this.props.tester;
    return <div className="test-inputlist-container">
      <button className="panel-button" onClick={()=>{
        this.props.tester.testPlaceholder();
        this.props.tester.testAll();
      }}>
        Run All Tests
      </button>

      <div className="test-inputlist-content">
        <TestingInput placeholder={true} index={-1} tester={tester} src={this.props.tester.placeholder}/>
        {
          this.props.tester.inputs.map((e, i) => {
            return <TestingInput key={i} index={i} tester={tester} src={e}/>
          })
        }
        <button className="panel-button"
          onClick={()=>this.props.tester.clear()}>
          Clear
        </button>
      </div>

      <button className="panel-button">
        Import Test
      </button>
    </div>;
  }
}

export default TestingInputList;
