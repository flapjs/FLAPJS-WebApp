import React from 'react';
import Style from './OverviewPanel.css';

import PanelSection from 'experimental/panels/PanelSection.js';

import StateListElement from './StateListElement.js';
import StateListView from './StateListView.js';

class OverviewPanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const currentModule = this.props.currentModule;
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{OverviewPanel.TITLE}</h1>
        </div>
        <div className={Style.panel_content}>
          <PanelSection title={"States"} initial={true}>
            <StateListView graphController={graphController}/>
          </PanelSection>
          <PanelSection title={"Alphabet"} initial={true}>
            <button>0</button>
          </PanelSection>
          <PanelSection title={"Transitions"} initial={true}>
            <PanelSection title={"Transition Chart"}>
            </PanelSection>
            <PanelSection title={"Transition Table"}>
            </PanelSection>
          </PanelSection>
        </div>
      </div>
    );
  }
}
Object.defineProperty(OverviewPanel, 'TITLE', {
  get: function() { return I18N.toString("component.overview.title"); }
});

export default OverviewPanel;
