import React from 'react';
import Style from './ExportPanel.css';

import PanelSection from './PanelSection.js';
import IconButton from 'test/components/IconButton.js';

class OptionPanel extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const module = this.props.currentModule;
    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{OptionPanel.TITLE}</h1>
        </div>
        <div className={Style.panel_content}>
          <PanelSection title={"What?"}>
          </PanelSection>
          <PanelSection title={"What?"}>
          </PanelSection>
        </div>
      </div>
    );
  }
}
Object.defineProperty(OptionPanel, 'TITLE', {
  get: function() { return I18N.toString("component.options.title"); }
});

export default OptionPanel;
