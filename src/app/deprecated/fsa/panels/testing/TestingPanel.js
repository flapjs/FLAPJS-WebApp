import React from 'react';
import '../Panel.css';
import './TestingPanel.css';

import { downloadText } from 'util/Downloader.js';

import TestingManager from 'deprecated/fsa/testing/TestingManager.js';
import TestingInput from './TestingInput.js';

import IconButton from 'deprecated/icons/IconButton.js';
import UploadTestButton from './components/UploadTestButton.js';

import UploadIcon from 'deprecated/icons/UploadIcon.js';
import CreateIcon from 'deprecated/icons/PageNewContentIcon.js';
import SaveIcon from 'deprecated/icons/SaveIcon.js';
import CloseIcon from 'deprecated/icons/CloseIcon.js';

const TEST_FILENAME = 'test.txt';

//TODO: This is faster, since it's pretty easy to tell latency here. But really it shouldn't.
const REFRESH_TEST_TICKS = 30;

class TestingPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.container = React.createRef();
        this.uploadInput = React.createRef();

        this.state = {
            errorCheckMode: this.props.currentModule.getTestingManager().getErrorCheckMode(),
            noTestMode: true
        };

        this._savedGraphHash = 0;
        this._ticksSinceHash = 0;
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
        const graphController = this.props.currentModule.getGraphController();
        const graph = graphController.getGraph();

        //HACK: this should be in FSABuilder and listen for machine changes instead
        this._savedGraphHash = graph.getHashCode();
        this._ticksSinceHash = 0;
    }

    componentWillUnmount()
    {
        const graphController = this.props.currentModule.getGraphController();
        const graph = graphController.getGraph();
        this._savedGraphHash = 0;
    }

    onGraphChange(g)
    {
        const tester = this.props.currentModule.getTestingManager();
        tester.inputList.resetTests();
    }

    onUploadFileChange(e)
    {
        const files = e.target.files;
        if (files.length > 0)
        {
            const tester = this.props.currentModule.getTestingManager();
            tester.inputList.importTests(files[0]);
            document.getElementById('test-name').innerHTML = files[0].name;

            //Makes sure you can upload the same file again.
            e.target.value = '';
        }
    }

    onChangeErrorCheckMode(e)
    {
        const value = e.target.value;

        const currentModule = this.props.currentModule;
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const tester = currentModule.getTestingManager();

        const graph = graphController.getGraph();
        const machineBuilder = machineController.getMachineBuilder();
        tester.setErrorCheckMode(value);

        //HACK: this should automatically be updated by testing manager on set error check mode
        if (tester.shouldCheckError)
        {
            machineBuilder.onGraphChange(graph);
        }

        this.setState({errorCheckMode: value});
    }

    onTestsRunAll(e)
    {
        const currentModule = this.props.currentModule;
        const machine = currentModule.getMachineController().getMachineBuilder().getMachine();
        const tester = currentModule.getTestingManager();
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
        const tester = this.props.currentModule.getTestingManager();
        tester.inputList.clearTests();
        this.clearTestName();
        this.hideTestInputList();
        this.setState({noTestMode: true});
    }

    onTestsSave(e)
    {
        const tester = this.props.currentModule.getTestingManager();
        downloadText(TEST_FILENAME, tester.inputList.getTestsAsStrings().join('\n'));
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

    showTestInputList() 
    {
        document.getElementById('test-inputlist-container').style.display = 'block';
    }

    hideTestInputList() 
    {
        document.getElementById('test-inputlist-container').style.display = 'none';
    }

    clearTestName() 
    {
        document.getElementById('test-name').innerHTML = '';
    }

    /** @override */
    render()
    {
        const currentModule = this.props.currentModule;
        const tester = currentModule.getTestingManager();
        const testList = tester.inputList;
        const machineBuilder = currentModule.getMachineController().getMachineBuilder();

        const isTestInvalid = !machineBuilder.isMachineValid();

        if (--this._ticksSinceHash <= 0)
        {
            this._ticksSinceHash = REFRESH_TEST_TICKS;
            const graph = currentModule.getGraphController().getGraph();
            const graphHash = graph.getHashCode();
            if (this._savedGraphHash !== graphHash)
            {
                this.onGraphChange(graph);
                this._savedGraphHash = graphHash;
            }
        }

        return <div className={'panel-container ' + this.props.className} id="testing" ref={ref=>this.container=ref} style={this.props.style}>
            <div className="panel-title">
                <h1>{I18N.toString('component.testing.title')}</h1>
            </div>

            <div className="test-icon-row">

                <IconButton className="testicon" id="testing-new" title={I18N.toString('action.testing.new')}
                    onClick={this.onTestsNew}>
                    <CreateIcon/>
                </IconButton>

                {/*Import Test Button*/}
                <UploadTestButton className="testicon" id="testing-upload" title={I18N.toString('action.testing.import')}
                    onClick={this.onTestsUpload} onChange={this.onUploadFileChange}>
                    <UploadIcon/>
                </UploadTestButton>

                {/*Save Test Button*/}
                <IconButton className="testicon" id="testing-save" title={I18N.toString('action.testing.save')}
                    onClick={this.onTestsSave} disabled={tester.inputList.isEmpty()}>
                    <SaveIcon/>
                </IconButton>

                <IconButton className="testicon" id="testing-clear" title={I18N.toString('action.testing.clear')}
                    onClick={this.onTestsClear}
                    disabled={this.state.noTestMode}>
                    <CloseIcon/>
                </IconButton>

            </div>

            <div className="panel-content">

                <div className="test-inputlist-container" id="test-inputlist-container" style={{'display': 'none'}}>


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
                        {tester.testMode.isStarted() ? I18N.toString('action.testing.stoprun') : I18N.toString('action.testing.runall')}
                    </button>

                    <div className="panel-checkbox">
                        <input id="test-step" type="checkbox"
                            checked={this.stepByStepModeChecked}
                            onChange={(e) => 
                            {
                                this.stepByStepModeChecked = e.target.checked;
                                if(!this.stepByStepModeChecked) tester.setStepByStepMode(false);
                            }}
                            disabled={tester.testMode.isStarted()}/>
                        <label htmlFor="test-step">{I18N.toString('options.testing.stepmode')}</label>
                    </div>

                </div>

                <hr />

                <div id="test-errorcheck">
                    <label>{I18N.toString('options.checkerrors')}</label>
                    <select className="panel-select"
                        value={this.state.errorCheckMode}
                        onChange={this.onChangeErrorCheckMode}>
                        <option value={TestingManager.NO_ERROR_CHECK}>{I18N.toString('options.checkerrors.mode.none')}</option>
                        <option value={TestingManager.DELAYED_ERROR_CHECK}>{I18N.toString('options.checkerrors.mode.delayed')}</option>
                        <option value={TestingManager.IMMEDIATE_ERROR_CHECK}>{I18N.toString('options.checkerrors.mode.immediate')}</option>
                    </select>
                </div>

            </div>

            <div className="panel-bottom"></div>
        </div>;
    }
}
Object.defineProperty(TestingPanel, 'TITLE', {
    get: function() { return I18N.toString('component.testing.title'); }
});
TestingPanel.UNLOCALIZED_NAME = 'component.testing.title';

export default TestingPanel;
