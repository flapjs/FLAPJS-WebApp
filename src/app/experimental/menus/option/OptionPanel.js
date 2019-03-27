import React from 'react';
import Style from './OptionPanel.css';

import LocalSave from 'system/localsave/LocalSave.js';
import StyleInput from 'system/styleopt/components/StyleInput.js';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';
import PanelButton from 'experimental/panels/PanelButton.js';

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
  }

  onChangeTheme(e)
  {
    const session = this.props.session;
    const app = session.getApp();
    const opts = app.getStyleOpts();
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

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const opts = session.getApp().getStyleOpts();

    return (
      <PanelContainer id={this.props.id}
        className={this.props.className}
        style={this.props.style}
        title={I18N.toString("component.options.title")}>
        <PanelSection title="Theme">
          <div style={{display: "flex"}}>
            <div style={{width: "60%"}}>
              <div id="options-theme-select-container">
                <select id="options-theme-select" className="panel-select" value={this.state.theme} onChange={this.onChangeTheme} disabled={this.state.customTheme}>
                  <option value="default">Default</option>
                  <option value="ucsd" disabled={true}>UC San Diego (Coming Soon)</option>
                  <option value="duke" disabled={true}>Duke University (Coming Soon)</option>
                  <option value="mit" disabled={true}>MIT (Coming Soon)</option>
                </select>
                {
                  !this.state.customTheme &&
                  <PanelButton onClick={() => this.setState({customTheme: true})}>
                    {I18N.toString("action.options.changetheme")}
                  </PanelButton>
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

                  <PanelButton onClick={(e) => {
                    for(let option of opts.getOptions())
                    {
                      option.resetStyle();
                    }
                    this.setState({customTheme: false});
                  }}>
                    {I18N.toString("action.options.reset")}
                  </PanelButton>
                </div>
              }
            </div>
            <div>
              <PreviewView/>
            </div>
          </div>
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

        <PanelButton onClick={() => {
          if (window.confirm("This will clear any cached or saved data. Are you sure you want to continue?"))
          {
            LocalSave.setStringToStorage("enableExperimental", "false");
            //TODO: This is only to force use default module, remove later.
            LocalSave.setStringToStorage("currentModule", "");

            try { LocalSave.terminate(); }
            catch(e){/* Ignore if it fails. */}

            window.alert("It's done! Restart to apply changes!");
          }
        }}>
          {"Get out of Experimental Mode and return to Safety"}
        </PanelButton>
      </PanelContainer>
    );
  }
}

export default OptionPanel;
