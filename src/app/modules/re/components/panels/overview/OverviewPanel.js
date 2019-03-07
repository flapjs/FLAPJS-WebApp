import React from 'react';
import Style from './OverviewPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';

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

    return (
      <PanelContainer id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={OverviewPanel.TITLE}>
        <PanelSection title={"Symbol Key"} initial={true}>
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
