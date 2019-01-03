import React from 'react';
import Style from './OptionPanel.css';

import LocalSave from 'system/localsave/LocalSave.js';

import PanelSection from 'experimental/panels/PanelSection.js';

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
            <p>If only there was cool stuff here...</p>
          </PanelSection>

          <PanelSection title={"What?"}>
          </PanelSection>

          <button onClick={() => {
            if (window.confirm("This will clear any cached or saved data. Are you sure you want to continue?"))
            {
              try { LocalSave.terminate(); }
              catch(e){/* Ignore if it fails. */}
              LocalSave.clearStorage();
              
              window.alert("It's done! Restart to apply changes!");
            }
          }}>
            {"Get out of Experimental Mode"}
          </button>

        </div>
      </div>
    );
  }
}

export default OptionPanel;
