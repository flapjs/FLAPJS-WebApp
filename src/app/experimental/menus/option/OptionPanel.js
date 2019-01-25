import React from 'react';
import Style from './OptionPanel.css';

import LocalSave from 'system/localsave/LocalSave.js';

import PanelSection from 'experimental/panels/PanelSection.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import Modules from 'modules/Modules.js'
import ModuleLoader from 'modules/ModuleLoader.js';

//This should be the same as the one referred to by index.js
const SKIP_WELCOME_STORAGE_ID = "skipWelcome";
const DISABLE_EXIT_WARNING_STORAGE_ID = "disableExitWarning";
const ENABLE_MODULES = process.env.NODE_ENV === 'development';

class OptionPanel extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      theme: "default",
      customTheme: false,
      skipWelcome: LocalSave.getStringFromStorage(SKIP_WELCOME_STORAGE_ID) === "true",
      exitWarning: LocalSave.getStringFromStorage(DISABLE_EXIT_WARNING_STORAGE_ID) === "true"
    };

    this.onChangeTheme = this.onChangeTheme.bind(this);
    this.onChangeModule = this.onChangeModule.bind(this);
  }

  onChangeTheme(e)
  {
    const prevTheme = this.state.theme;
    const theme = e.target.value;
    if (prevTheme === theme) return;

    if (theme === "default")
    {
      for(let option of this.styleOpts.getOptions())
      {
        option.resetStyle();
      }
    }

    this.setState({theme: theme});
  }

  onChangeModule(e)
  {
    ModuleLoader.loadModule(e.target.value);
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

          <PanelSwitch id={"option-skipwelcome"}
            checked={this.state.skipWelcome}
            title={I18N.toString("options.skipwelcome")}
            onChange={(e) => {
              const result = e.target.checked;
              this.setState({skipWelcome: result});
              LocalSave.setStringToStorage(SKIP_WELCOME_STORAGE_ID, "" + result);
            }}/>
          <PanelSwitch id={"option-exitwarning"}
            checked={this.state.exitWarning}
            title={I18N.toString("options.exitwarning")}
            onChange={(e) => {
              const result = e.target.checked;
              this.setState({exitWarning: result});
              LocalSave.setStringToStorage(DISABLE_EXIT_WARNING_STORAGE_ID, "" + result);
            }}/>

        </div>
      </div>
    );
  }
}

export default OptionPanel;
