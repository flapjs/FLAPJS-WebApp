import React from 'react';
import Style from './OptionPanel.css';

import LocalSave from 'system/localsave/LocalSave.js';
import StyleInput from 'system/styleopt/components/StyleInput.js';

import PanelSection from 'experimental/panels/PanelSection.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import Modules from 'modules/Modules.js'
import ModuleLoader from 'modules/ModuleLoader.js';

import PreviewView from './PreviewView.js';

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
    const opts = this.props.app.getStyleOpts();
    const prevTheme = this.state.theme;
    const theme = e.target.value;
    if (prevTheme === theme) return;

    if (theme === "default")
    {
      for(let option of opts.getOptions())
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
    const opts = this.props.app.getStyleOpts();

    return (
      <div id={this.props.id}
        className={Style.panel_container +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.panel_title}>
          <h1>{I18N.toString("component.options.title")}</h1>
        </div>
        <div className={Style.panel_content}>

          <PanelSection title="Theme">
            <div style={{display: "flex"}}>
              <div style={{width: "60%"}}>
                <div id="options-theme-select-container">
                  <select id="options-theme-select" className="panel-select" value={this.state.theme} onChange={this.onChangeTheme} disabled={this.state.customTheme}>
                    <option value="default">Default</option>
                    <option value="ucsd" disabled={true}>UC San Diego (Coming Soon)</option>
                    <option value="duke" disabled={true}>Duke University (Coming Soon)</option>
                  </select>
                  {
                    !this.state.customTheme &&
                    <button className="panel-button" onClick={() => this.setState({customTheme: true})}>
                      {I18N.toString("action.options.changetheme")}
                    </button>
                  }
                </div>
                {
                  this.state.customTheme && <div>

                    <PanelSection title={"General Colors"} full={true}>
                      {opts.getPropsByGroup("general").map(e => (
                        <div key={e}>
                          <StyleInput value={opts.getOptionByProp(e)}
                            title={I18N.toString("options." + e)}/>
                        </div>
                      ))}
                    </PanelSection>

                    <PanelSection title={"Surface Colors"} full={true}>
                      {opts.getPropsByGroup("surface").map(e => (
                        <div key={e}>
                          <StyleInput value={opts.getOptionByProp(e)}
                            title={I18N.toString("options." + e)}/>
                        </div>
                      ))}
                    </PanelSection>

                    <PanelSection title={"Graph Colors"} full={true}>
                      {opts.getPropsByGroup("graph").map(e => (
                        <div key={e}>
                          <StyleInput value={opts.getOptionByProp(e)}
                            title={I18N.toString("options." + e)}/>
                        </div>
                      ))}
                    </PanelSection>

                    <button className="panel-button" onClick={(e) => {
                      for(let option of opts.getOptions())
                      {
                        option.resetStyle();
                      }
                      this.setState({customTheme: false});
                    }}>{I18N.toString("action.options.reset")}</button>
                  </div>
                }
              </div>
              <div>
                <PreviewView/>
              </div>
            </div>
          </PanelSection>

          <PanelSection title="Module">
            <select id="options-experimental-modules"
              className="panel-select"
              value={this.props.currentModule.getModuleName()}
              onChange={this.onChangeModule}
              disabled={!ENABLE_MODULES}>
            {Object.keys(Modules).map(e => {
              const mod = Modules[e];
              return (
                <option key={e} value={e}>
                  {mod.name + " (" + mod.version + ")"}
                </option>
              );
            })}
            </select>
          </PanelSection>

          <PanelDivider/>

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

          <PanelDivider/>

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
