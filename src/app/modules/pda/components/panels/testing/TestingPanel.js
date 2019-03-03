import React from 'react';
import Style from './TestingPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import TestListView from './TestListView.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      stepMode: false,
      errorCheck: false
    };

    this.onStepTestChange = this.onStepTestChange.bind(this);
    this.onAutoErrorCheckChange = this.onAutoErrorCheckChange.bind(this);
  }

  //Override
  componentDidMount()
  {
    //TODO: This should be in modules...
    const session = this.props.session;
    const app = session.getApp();
    const currentModule = session.getCurrentModule();
    const tester = currentModule._tester;
    tester.on("startTest", (tester) => {
      app._viewport.setCurrentView(1);
      app._drawer.setDrawerSoloClass(TestingPanel);
      app._drawer.closeDrawer();
    });
    tester.on("stopTest", (tester) => {
      app._viewport.setCurrentView(0);
      app._drawer.setDrawerSoloClass(null);
      app._drawer.openDrawer();
    });
  }

  onStepTestChange(e)
  {
    this.setState((prev, props) => {
      return {stepMode: !prev.stepMode};
    });
  }

  onAutoErrorCheckChange(e)
  {
    this.setState((prev, props) => {
      return {errorCheck: !prev.errorCheck};
    });
  }

  //Override
  render()
  {
    const session = this.props.session;
    const app = session.getApp();
    const currentModule = session.getCurrentModule();
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const tester = currentModule._tester;

    const stepMode = this.state.stepMode;
    const errorCheck = this.state.errorCheck;

    return (
      <PanelContainer id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}
        title={TestingPanel.TITLE}>

        <TestListView tester={tester} graphController={graphController} machineController={machineController} immediate={!stepMode}/>
        <PanelSwitch id={"testing-step-test"} checked={stepMode} onChange={this.onStepTestChange} title={"Step testing"}/>
        <PanelSwitch id={"testing-error-check"} checked={errorCheck} onChange={this.onAutoErrorCheckChange} title={"Auto error checking"} disabled={true}/>

      </PanelContainer>
    );
  }
}
Object.defineProperty(TestingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.testing.title"); }
});

export default TestingPanel;
