import React from 'react';
import './TestingInputList.css';

import TestingInput from './TestingInput.js';

class TestingInputList extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onUploadFileChange = this.onUploadFileChange.bind(this);
  }

  onUploadFileChange(e)
  {
    const fileBlob = e.target.files[0];
    if (!fileBlob) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      try
      {
        const testInputs = data.replace(/\n/g, ",").split(",");
        for(const testInput of testInputs)
        {
          this.props.tester.addTestInput(testInput.trim());
        }
      }
      catch(e)
      {
        reader.abort();
      }
    };
    reader.readAsText(fileBlob);
  }

  render()
  {
    const tester = this.props.tester;
    //TODO: upload file button
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
      <button className="panel-button" id="test-upload">
        <input id="test-upload-input" type="file" name="import" style={{display: "none"}}
          onChange={this.onUploadFileChange} accept=".txt"/>
        <label className="panel-button-label" htmlFor="test-upload-input">
          Import Tests
        </label>
      </button>
    </div>;
  }
}

export default TestingInputList;
