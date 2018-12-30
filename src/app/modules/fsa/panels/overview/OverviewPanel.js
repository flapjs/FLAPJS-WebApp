import React from 'react';
import '../Panel.css';
import './OverviewPanel.css';

import Config from 'config.js';

import FormattedInput from 'system/formattedinput/FormattedInput.js';

import StatesList from './stateslist/StatesList.js';
import AlphabetList from './alphabetlist/AlphabetList.js';
import TransitionTable from './transitiontable/TransitionTable.js';
import TransitionFunction from './transitionfunction/TransitionFunction.js';
import FormalDefinition from "./formaldefinition/FormalDefinition";

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = null;

    this.state = {
      viewFormal: false
    };

    this.onChangeMachineType = this.onChangeMachineType.bind(this);
    this.onAutoLayout = this.onAutoLayout.bind(this);

    this.onChangeAutoRename = this.onChangeAutoRename.bind(this);
    this.onSubmitAutoStatePrefix = this.onSubmitAutoStatePrefix.bind(this);
    this.onAutoStateFormat = this.onAutoStateFormat.bind(this);

    this.switchDefinition = this.switchDefinition.bind(this);
  }

  onAutoLayout(e)
  {
    const graphController = this.props.currentModule.getGraphController();
    graphController.applyAutoLayout();
  }

  onChangeMachineType(e)
  {
    const value = e.target.value;
    const machineController = this.props.machineController;
    machineController.changeMachineTo(value);
  }

  onChangeAutoRename(e)
  {
    const machineBuilder = this.props.currentModule.getMachineController().getMachineBuilder();
    machineBuilder.setAutoRenameNodes(e.target.checked);
  }

  onSubmitAutoStatePrefix(next, prev)
  {
    const labeler = this.props.machineController.getMachineBuilder().getLabeler();
    if (labeler.prefix != next)
    {
      labeler.prefix = next;
      labeler.sortDefaultNodeLabels();
    }
  }

  onAutoStateFormat(value)
  {
    return value && value.length > 0 ? value : Config.STR_STATE_LABEL;
  }

  switchDefinition()
  {
    this.setState((prev, props) => {
      return { viewFormal: !prev.viewFormal };
    });
  }

  render()
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();

    const graph = graphController.getGraph();
    const machineBuilder = machineController.getMachineBuilder();

    return <div className="panel-container" id="overview" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title">
        <h1>{I18N.toString("component.overview.title")}</h1>
      </div>
        <div className="panel-content">
          <select className="machine-type panel-select"
            value={machineBuilder.getMachineType()}
            onChange={this.onChangeMachineType}>
            <option value="DFA">DFA</option>
            <option value="NFA">NFA</option>
          </select>

          {this.state.viewFormal &&
            <FormalDefinition machineBuilder={machineBuilder}/>}

          {
            !this.state.viewFormal &&
            <div>
              <div>
                <div className="graphinfo-important">
                  <StatesList graphController={graphController}/>
                  <AlphabetList machineController={machineController}/>
                </div>
                <div className="graphinfo">
                  <TransitionFunction machineBuilder={machineBuilder}/>
                  <TransitionTable machineBuilder={machineBuilder}/>
                </div>
              </div>
              <hr/>

              {/*State Labeling*/}
              <div style={{paddingBottom: "0.5em"}}>
                <h3 style={{marginBottom: "0"}}>State Labels</h3>
                <div style={{display: "flex", flexDirection: "row"}}>
                  <div className="statetag-container">
                    <FormattedInput defaultValue={machineBuilder.getLabeler().prefix} style={{width: "4em"}} formatter={this.onAutoStateFormat} captureOnExit="save" onSubmit={this.onSubmitAutoStatePrefix}/>
                  </div>
                  <select style={{
                      background: "none",
                      outline: "none",
                      border: "none",
                      padding: "0",
                      margin: "0",
                      appearance: "none",
                      color: "white"
                    }} disabled={true}>
                    <option>{"0-9"}</option>
                    <option>{"a-z"}</option>
                    <option>{"A-Z"}</option>
                  </select>
                </div>
                <div className="panel-checkbox">

                  <input type="checkbox" id="auto-statename"
                    onChange={this.onChangeAutoRename}
                    checked={machineBuilder.shouldAutoRenameNodes()}/>
                  <label htmlFor="auto-statename">{I18N.toString("options.autolabel")}</label>
                </div>
              </div>

              <hr/>

              <button className="panel-button" onClick={this.onAutoLayout} disabled={graph.isEmpty()}>
                {I18N.toString("action.overview.autolayout")}
              </button>
            </div>
          }

          <button className="panel-button" onClick={this.switchDefinition}>
            {this.state.viewFormal ? "Back" : "View Definition"}
          </button>
        </div>
      <div className="panel-bottom"></div>
    </div>;
  }
}
OverviewPanel.UNLOCALIZED_NAME = "component.overview.title";

export default OverviewPanel;
