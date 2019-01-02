import React from 'react';
import Style from './OptionPanel.css';

import PanelSection from 'test/panels/PanelSection.js';

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
          <h1>{I18N.toString("component.options.title")}</h1>
        </div>
        <div className={Style.panel_content}>
          <PanelSection title={"Customize stuff"}>
          </PanelSection>
          <PanelSection title={"What?"}>
          </PanelSection>
        </div>
      </div>
    );
  }
}

export default OptionPanel;
