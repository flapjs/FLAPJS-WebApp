import React from 'react';
import './TestList.css';

import TestInput from './TestInput.js';

class TestList extends React.Component
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
    const machineBuilder = this.props.machineBuilder;

    return <div className="test-inputlist-container">
      <button className="panel-button" onClick={()=>{
        const machine = machineBuilder.getMachine();
        tester.testPlaceholder(machine);
        tester.testAll(machine);
      }}>
        Run All Tests
      </button>

      <div className="scrollbar-container">
      <div className="test-inputlist-content">
        <TestInput placeholder={true} index={-1} machineBuilder={machineBuilder} tester={tester} src={tester.placeholder}/>
        {
          tester.inputs.map((e, i) => {
            if (!e) return null;

            return <TestInput key={e.toString() + "." + i} index={i} machineBuilder={machineBuilder} tester={tester} src={e}/>;
          })
        }
        <button className="panel-button"
          onClick={()=>tester.clear(true)}>
          Clear
        </button>
      </div>
      </div>

      <button className="panel-button" id="test-upload">
        <input id="test-upload-input" type="file" name="import" style={{display: "none"}}
          onChange={this.onUploadFileChange} accept=".txt"/>
        <label htmlFor="test-upload-input">
          Import Tests
        </label>
      </button>
    </div>;
  }
}

export default TestList;
