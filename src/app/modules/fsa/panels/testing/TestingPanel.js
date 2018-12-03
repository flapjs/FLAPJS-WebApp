import React from 'react';
import '../Panel.css';
import './TestingPanel.css';

import Viewport from 'content/viewport/Viewport.js';

import Downloader from 'util/Downloader.js';

import TestingManager from 'modules/fsa/testing/TestingManager.js';
import TestingInput from './TestingInput.js';

import IconButton from 'icons/IconButton.js';
import UploadTestButton from './components/UploadTestButton.js';

import UploadIcon from 'icons/UploadIcon.js';
import CreateIcon from 'icons/PageNewContentIcon.js';
import SaveIcon from 'icons/SaveIcon.js';
import CloseIcon from 'icons/CloseIcon.js';

const TEST_FILENAME = "test.txt";

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = React.createRef();
    this.uploadInput = React.createRef();

    this.state = {
      errorCheckMode: this.props.app.testingManager.getErrorCheckMode(),
      noTestMode: true
    };

    this.stepByStepModeChecked = false;

    this.onChangeErrorCheckMode = this.onChangeErrorCheckMode.bind(this);
    this.onUploadFileChange = this.onUploadFileChange.bind(this);
    this.onGraphChange = this.onGraphChange.bind(this);
    this.onTestsRunAll = this.onTestsRunAll.bind(this);
    this.onTestsClear = this.onTestsClear.bind(this);
    this.onTestsSave = this.onTestsSave.bind(this);
    this.onTestsNew = this.onTestsNew.bind(this);
    this.onTestsUpload = this.onTestsUpload.bind(this);
  }

  componentWillMount()
  {
    const graphController = this.props.graphController;
    const graph = graphController.getGraph();

    //HACK: this should be a listener to FSABuilder, should not access graph
    graph.on("markDirty", this.onGraphChange);
  }

  componentWillUnmount()
  {
    const graphController = this.props.graphController;
    const graph = graphController.getGraph();

    graph.removeEventListener("markDirty", this.onGraphChange);
  }

  onGraphChange(g)
  {
    const app = this.props.app;
    const tester = app.testingManager;
    tester.inputList.resetTests();
  }

  onUploadFileChange(e)
  {
    const files = e.target.files;
    if (files.length > 0)
    {
      const app = this.props.app;
      const tester = app.testingManager;
      tester.inputList.importTests(files[0]);
      document.getElementById("test-name").innerHTML = files[0].name;

      //Makes sure you can upload the same file again.
      e.target.value = "";
    }
  }

  onChangeErrorCheckMode(e)
  {
    const value = e.target.value;

    const graphController = this.props.graphController;
    const machineController = this.props.machineController;
    const app = this.props.app;
    const tester = app.testingManager;

    const graph = graphController.getGraph();
    const machineBuilder = machineController.getMachineBuilder();
    tester.setErrorCheckMode(value);

    //HACK: this should automatically be updated by testing manager on set error check mode
    if (!tester.shouldCheckError)
    {
      machineBuilder.machineErrorChecker.clear();
    }
    else
    {
      machineBuilder.onGraphChange(graph);
    }

    this.setState({errorCheckMode: value});
  }

  onTestsRunAll(e)
  {
    const machine = this.props.machineController.getMachineBuilder().getMachine();
    const app = this.props.app;
    const tester = app.testingManager;
    if (tester.testMode.isStarted())
    {
      tester.setStepByStepMode(false);
    }
    else
    {
      const testList = tester.inputList;
      const length = testList.getTests().length;
      tester.setStepByStepMode(this.stepByStepModeChecked);
      for(let i = 0; i < length; ++i)
      {
        testList.testByIndex(i, machine);
      }
    }
  }

  onTestsClear(e)
  {
    const app = this.props.app;
    const tester = app.testingManager;
    tester.inputList.clearTests();
    this.clearTestName();
    this.hideTestInputList();
    this.setState({noTestMode: true});
  }

  onTestsSave(e)
  {
    const app = this.props.app;
    const tester = app.testingManager;
    Downloader.downloadText(TEST_FILENAME, tester.inputList.getTestsAsStrings().join("\n"));
  }

  onTestsNew(e)
  {
      this.onTestsClear();
      this.showTestInputList();
      this.clearTestName();
      this.setState({noTestMode: false});
  }

  onTestsUpload(e)
  {
      this.onTestsNew();
      this.showTestInputList();
  }

  showTestInputList() {
      document.getElementById("test-inputlist-container").style.display = "block";
  }

  hideTestInputList() {
      document.getElementById("test-inputlist-container").style.display = "none";
  }

  clearTestName() {
      document.getElementById("test-name").innerHTML = "";
  }

  render()
  {
    const app = this.props.app;
    const viewport = app.viewport;
    const tester = app.testingManager;
    const testList = tester.inputList;
    const machineBuilder = this.props.machineController.getMachineBuilder();

    const isTestInvalid = !machineBuilder.isValidMachine();

    return <div className="panel-container" id="testing" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title">
        <h1>{I18N.toString("component.testing.title")}</h1>
      </div>

      <div className="test-icon-row">

          <IconButton className="testicon" id="testing-new" title={I18N.toString("action.testing.new")}
            onClick={this.onTestsNew}>
            <CreateIcon/>
          </IconButton>

          {/*Import Test Button*/}
          <UploadTestButton className="testicon" id="testing-upload" title={I18N.toString("action.testing.import")}
            onClick={this.onTestsUpload} onChange={this.onUploadFileChange}>
            <UploadIcon/>
          </UploadTestButton>

          {/*Save Test Button*/}
          <IconButton className="testicon" id="testing-save" title={I18N.toString("action.testing.save")}
            onClick={this.onTestsSave} disabled={tester.inputList.isEmpty()}>
            <SaveIcon/>
          </IconButton>

          <IconButton className="testicon" id="testing-clear" title={I18N.toString("action.testing.clear")}
            onClick={this.onTestsClear}
            disabled={this.state.noTestMode}>
            <CloseIcon/>
          </IconButton>

      </div>

      <div className="panel-content">

        <div className="test-inputlist-container" id="test-inputlist-container" style={{"display": "none"}}>


          <div className="scrollbar-container">
            <h3 id="test-name">Test Name</h3>
            <div className="test-inputlist-content">
              {
                isTestInvalid &&
                <label className="test-inputlist-content-warning">Not a valid machine!</label>
              }
              {
                testList.getTests().map((e, i) =>
                  <TestingInput key={e.id} index={i}
                    testList={testList}
                    machineBuilder={machineBuilder}/>)
              }
              {
                /*
                <button className="panel-button" onClick={() => testList.addInput("")}>
                  {I18N.toString("action.testing.add")}
                </button>
                */
              }
            </div>
          </div>

          <button className="panel-button" onClick={this.onTestsRunAll}>
            {tester.testMode.isStarted() ? I18N.toString("action.testing.stoprun") : I18N.toString("action.testing.runall")}
          </button>

          <div className="panel-checkbox">
            <input id="test-step" type="checkbox"
              checked={this.stepByStepModeChecked}
              onChange={(e) => {
                this.stepByStepModeChecked = e.target.checked;
                if(!this.stepByStepModeChecked) tester.setStepByStepMode(false);
              }}
              disabled={tester.testMode.isStarted()}/>
            <label htmlFor="test-step">{I18N.toString("options.testing.stepmode")}</label>
          </div>

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

      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}
TestingPanel.UNLOCALIZED_NAME = "component.testing.title";

export default TestingPanel;
