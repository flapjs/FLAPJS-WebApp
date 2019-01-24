import React from 'react';
import Style from './TestingPanel.css';

import TestListView from './TestListView.js';

import PanelSwitch from 'experimental/panels/PanelSwitch.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      stepMode: false
    };

    this.onStepTestChange = this.onStepTestChange.bind(this);
    this.onAutoErrorCheckChange = this.onAutoErrorCheckChange.bind(this);
  }

  //Override
  componentDidMount()
  {
    //TODO: This should be in modules...
    const app = this.props.app;
    const currentModule = this.props.currentModule;
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
    
  }

  //Override
  render()
  {
    const app = this.props.app;
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const tester = currentModule._tester;

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{TestingPanel.TITLE}</h1>
        </div>
        <div className={Style.panel_content}>
          <TestListView tester={tester} graphController={graphController} machineController={machineController} immediate={!this.state.stepMode}/>
          <PanelSwitch id={"testing-step-test"} checked={this.state.stepMode} onChange={this.onStepTestChange} title={"Step testing"}/>
          <PanelSwitch id={"testing-error-check"} checked={false} onChange={this.onAutoErrorCheckChange} title={"Auto error checking"}/>
        </div>
      </div>
    );
  }
}
Object.defineProperty(TestingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.testing.title"); }
});

export default TestingPanel;
