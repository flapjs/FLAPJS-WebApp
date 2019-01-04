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
    const tester = app._tester;
    tester.on("startTest", (tester) => {
      app._viewport.setViewIndex(1);
    });
    tester.on("stopTest", (tester) => {
      app._viewport.setViewIndex(0);
    });
  }

  //Override
  render()
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();

    //TODO: This should be in modules...
    const app = this.props.app;
    const tester = app._tester;

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
        </div>
      </div>
    );
  }
}
Object.defineProperty(TestingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.testing.title"); }
});

export default TestingPanel;
