import React from 'react';
import Style from './TestingPanel.css';

import TestListView from './TestListView.js';

import PanelCheckbox from 'experimental/panels/PanelCheckbox.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);
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
          <TestListView tester={tester} graphController={graphController} machineController={machineController}/>
          <PanelCheckbox title={"Step Testing"}/>
          <PanelCheckbox title={"Automatic Error Checking"}/>
        </div>
      </div>
    );
  }
}
Object.defineProperty(TestingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.testing.title"); }
});

export default TestingPanel;
