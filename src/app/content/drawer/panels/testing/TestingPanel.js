import React from 'react';
import '../Panel.css';
import './TestingPanel.css';
import './components/TestList.css';

import TestingManager from 'testing/TestingManager.js';
import TestingInput from './TestingInput.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();
    this.uploadInput = React.createRef();

    this.state = {
      errorCheckMode: this.props.tester.getErrorCheckMode()
    };

    this.onChangeErrorCheckMode = this.onChangeErrorCheckMode.bind(this);
    this.onUploadFileChange = this.onUploadFileChange.bind(this);
    this.onGraphChange = this.onGraphChange.bind(this);
    this.onTestsRunAll = this.onTestsRunAll.bind(this);
    this.onTestsClear = this.onTestsClear.bind(this);
  }

  componentWillMount()
  {
    //HACK: this should be a listener to FSABuilder, should not access graph
    this.props.machineBuilder.graph.on("markDirty", this.onGraphChange);
  }

  componentWillUnmount()
  {
    this.props.machineBuilder.graph.removeEventListener("markDirty", this.onGraphChange);
  }

  onGraphChange(g)
  {
    this.props.tester.inputList.resetTests();
  }

  onUploadFileChange(e)
  {
    const files = e.target.files;
    if (files.length > 0)
    {
      this.props.tester.inputList.importTests(files[0]);

      //Makes sure you can upload the same file again.
      e.target.value = "";
    }
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

  onTestsRunAll(e)
  {
    const machine = this.props.machineBuilder.getMachine();
    const testList = this.props.tester.inputList;
    const length = testList.getTests().length;
    for(let i = 0; i < length; ++i)
    {
      testList.testByIndex(i, machine);
    }
  }

  onTestsClear(e)
  {
    this.props.tester.inputList.clearTests();
  }

  render()
  {
    const machineBuilder = this.props.machineBuilder;
    const tester = this.props.tester;
    const testList = tester.inputList;

    return <div className="panel-container" id="testing" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>{I18N.toString("component.testing.title")}</h1>
      </div>

      <div className="panel-content">

        <div className="test-inputlist-container">
          <button className="panel-button" onClick={this.onTestsRunAll}>
            {I18N.toString("action.testing.runall")}
          </button>

          <div className="scrollbar-container">
            <div className="test-inputlist-content">
              {testList.getTests().map((e, i) =>
                <TestingInput key={e.id} index={i}
                  testList={testList}
                  machineBuilder={machineBuilder}/>)}
              <button className="panel-button" onClick={this.onTestsClear}>
                {I18N.toString("action.testing.clear")}
              </button>
            </div>
          </div>

          <button className="panel-button" id="test-upload" onClick={() => this.uploadInput.click()}>
            <input ref={ref=>this.uploadInput=ref}
              id="test-upload-input" type="file" name="import"
              style={{display: "none"}}
              onChange={this.onUploadFileChange} accept=".txt"/>
            {I18N.toString("action.testing.import")}
          </button>
        </div>

        <hr />

        <div id="test-errorcheck">
          <label>{I18N.toString("options.checkerrors")}</label>
          <select className="panel-select"
            value={this.state.errorCheckMode}
            onChange={this.onChangeErrorCheckMode}>
            <option value={TestingManager.NO_ERROR_CHECK}>{I18N.toString("options.checkerrors.mode.none")}</option>
            <option value={TestingManager.DELAYED_ERROR_CHECK}>{I18N.toString("options.checkerrors.mode.delayed")}</option>
            <option value={TestingManager.IMMEDIATE_ERROR_CHECK}>{I18N.toString("options.checkerrors.mode.immediate")}</option>
          </select>
        </div>
        <div className="panel-checkbox">
          <input id="test-step" type="checkbox" onChange={(e) => {
            //HACK: this needs to default to tester.getStepByStepMode first
            tester.setStepByStepMode(e.target.checked);
            if (tester.getStepByStepMode())
            {
              if (tester.testMode.isStarted()) tester.testMode.onStop();
              tester.testMode.onStart();
            }
            else
            {
              if (tester.testMode.isStarted()) tester.testMode.onStop();
            }
          }}/>
          <label htmlFor="test-step">{I18N.toString("options.testing.stepmode")}</label>
        </div>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default TestingPanel;
