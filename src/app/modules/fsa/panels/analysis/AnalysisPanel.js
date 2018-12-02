import React from 'react';
import Config from 'config.js';

import Notification from 'system/notification/Notification.js';
import NFAToDFAConversionWarningMessage from 'modules/fsa/notifications/NFAToDFAConversionWarningMessage.js';

class AnalysisPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.container = null;

    this.onConvertToDFA = this.onConvertToDFA.bind(this);
    this.onConvertToNFA = this.onConvertToNFA.bind(this);
  }

  onConvertToDFA(e)
  {
    const machineController = this.props.machineController;
    const graphController = this.props.graphController;
    const props = {graphController: graphController, machineController: machineController};
    const messageTag = Config.MACHINE_ERRORS_MESSAGE_TAG;

    Notification.addMessage(I18N.toString("message.warning.convertNFAToDFA"),
      "warning", messageTag, NFAToDFAConversionWarningMessage, props, false);

    //machineController.convertMachineTo("DFA");
  }

  onConvertToNFA(e)
  {
    const machineController = this.props.machineController;
    machineController.convertMachineTo("NFA");
  }

  render()
  {
    const graphController = this.props.graphController;
    const machineController = this.props.machineController;

    const graph = graphController.getGraph();
    const machineBuilder = machineController.getMachineBuilder();

    return <div className="panel-container" id="analysis" ref={ref=>this.container=ref} style={this.props.style}>
      <div className="panel-title"><h1>{I18N.toString("component.analysis.title")}</h1></div>
      <div className="panel-content">

        {/*Optimize*/}
        <div style={{paddingBottom: "0.5em"}}>
          <h3 style={{marginBottom: "0"}}>Optimizations</h3>
          <div style={{paddingBottom: "0.5em"}}>
            <div>
              <input id="opt-unreach"type="checkbox"/><label htmlFor="opt-unreach">Unreachables</label>
            </div>
            <div>
              <input id="opt-redund"type="checkbox"/><label htmlFor="opt-redund">Redundant States</label>
            </div>
          </div>
          <button className="panel-button" disabled="true">Optimize</button>
        </div>

        <hr/>
        {
          machineBuilder.getMachineType() == "DFA" ?
            <button className="panel-button" onClick={this.onConvertToNFA}>
              {I18N.toString("action.overview.convertnfa")}
            </button>
          : machineBuilder.getMachineType() == "NFA" ?
            <button className="panel-button" onClick={this.onConvertToDFA}>
              {I18N.toString("action.overview.convertdfa")}
            </button>
          : null
        }

      </div>
      <div className="panel-bottom"></div>
    </div>;
  }
}
AnalysisPanel.UNLOCALIZED_NAME = "component.analysis.title";

export default AnalysisPanel;
