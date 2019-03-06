import React from 'react';
import Style from './TestingPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';
import PanelSection from 'experimental/panels/PanelSection.js';

import TestListView from './TestListView.js';

class TestingPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onAutoErrorCheckChange = this.onAutoErrorCheckChange.bind(this);
  }

  onAutoErrorCheckChange(e)
  {
    //TODO: to be implemented.
  }

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    return (
      <PanelContainer id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}
        title={TestingPanel.TITLE}>

        <TestListView tester={tester} graphController={graphController} machineController={machineController} immediate={!stepMode}/>
        <PanelSwitch id={"testing-error-check"} checked={false} onChange={this.onAutoErrorCheckChange} title={"Auto error checking"} disabled={true}/>

      </PanelContainer>
    );
  }
}
Object.defineProperty(TestingPanel, 'TITLE', {
  get: function() { return I18N.toString("component.testing.title"); }
});

export default TestingPanel;
