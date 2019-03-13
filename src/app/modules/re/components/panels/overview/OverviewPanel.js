import React from 'react';
import Style from './OverviewPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';

import AlphabetListView from './alphabet/AlphabetListView.js';

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const drawer = this.props.drawer;
    const session = this.props.session;
    const currentModule = session.getCurrentModule();

    const machineController = currentModule.getMachineController();
    const drawerFull = drawer.isDrawerFullscreen();

    return (
      <PanelContainer id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={OverviewPanel.TITLE}>
        <PanelSection title={"Terminals"} initial={true} full={drawerFull}>
          <AlphabetListView machineController={machineController}/>
        </PanelSection>
        <PanelSection title={"Symbol Key"} initial={true} full={drawerFull}>
          <label>Legends tell of an amazing human rising from the void beyond and fulfilling the emptiness below...</label>
        </PanelSection>
      </PanelContainer>
    );
  }
}
Object.defineProperty(OverviewPanel, 'TITLE', {
  get: function() { return I18N.toString("component.overview.title"); }
});

export default OverviewPanel;
