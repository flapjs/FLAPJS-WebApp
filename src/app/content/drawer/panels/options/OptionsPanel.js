import React from 'react';
import '../Panel.css';
import './OptionsPanel.css';

import Storage from 'util/Storage.js';
import Config from 'config.js';
import { saveConfig } from 'config.js';

import OptionGroup from './OptionGroup.js';
import OptionHotkey from './OptionHotkey.js';
import OptionColor from './OptionColor.js';

//This should be the same as the one referred to by index.html
const LOCAL_STORAGE_ID = "skipWelcome";

class OptionsPanel extends React.Component
{
  constructor(props)
  {
    super(props)

    this.container = React.createRef();

    this.state = {
      skipWelcome: Storage.loadFromLocalStorage(LOCAL_STORAGE_ID) == "true"
    };
  }

  render()
  {
    const root = document.getElementById("root");
    return <div className="panel-container" id="option" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>{I18N.toString("OPTIONS_PANEL_TITLE")}</h1>
      </div>
      <div className="panel-content">

        <button className="panel-button" disabled="true">{I18N.toString("CHOOSE_COLOR_THEME")}</button>

        <hr/>

        <OptionGroup title={I18N.toString("WORKSPACE_TITLE")} label={I18N.toString("CATEGORY_SHORTCUTS")}>
          <OptionHotkey label={I18N.toString("ACTION_SAVE_MACHINE")} keyName="Ctrl + S"/>
          <OptionHotkey label={I18N.toString("ACTION_UNDO")} keyName="Ctrl + Z"/>
          <OptionHotkey label={I18N.toString("ACTION_REDO")} keyName="Ctrl + Shift + Z"/>
          <OptionHotkey label={I18N.toString("ACTION_SAVE_IMAGE")} keyName="Ctrl + P"/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("TESTING_PANEL_TITLE")} label={I18N.toString("CATEGORY_SHORTCUTS")}>
          <OptionHotkey label="Submit Change" keyName="Enter"/>
          <OptionHotkey label="Cancel Change" keyName="Escape"/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("TOOLBAR_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Main Color" propName="--color-toolbar-main" root={root}
            dark="true"/>
          <OptionColor label="Accent Color" propName="--color-toolbar-accent" root={root}
            dark="true"/>
          <OptionColor label="Text Color" propName="--color-toolbar-text" root={root}
            invert="true"/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("DRAWER_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Main Color" propName="--color-drawer-main" root={root}
            dark="true"/>
          <OptionColor label="Accent Color" propName="--color-drawer-accent" root={root}/>
          <OptionColor label="Text Color" propName="--color-drawer-text" root={root}
            subtle="true"
            ghost="true"
            invert="true"
            back="true"/>
          <OptionColor label="Error Color" propName="--color-drawer-error" root={root}/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("TESTING_PANEL_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Success Color" propName="--color-testing-success" root={root}/>
          <OptionColor label="Failure Color" propName="--color-testing-failure" root={root}/>
          <OptionColor label="Working Color" propName="--color-testing-working" root={root}/>
          <OptionColor label="Text Color" propName="--color-testing-text" root={root}/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("NOTIFICATION_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Text Color" propName="--color-notification-text" root={root}/>
          <OptionColor label="Info Color" propName="--color-notification-info" root={root}
            dark="true"/>
          <OptionColor label="Error Color" propName="--color-notification-error" root={root}
            dark="true"/>
          <OptionColor label="Warning Color" propName="--color-notification-warning" root={root}
            dark="true"/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("GRAPH_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Node Color" propName="--color-graph-node" root={root}/>
          <OptionColor label="Text Color" propName="--color-workspace-text" root={root}/>
          <OptionColor label="Main Color" propName="--color-workspace-main" root={root}/>
          <OptionColor label="Label Editor Main Color" propName="--color-labeleditor-main" root={root}/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("LABEL_EDITOR_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Text Color" propName="--color-labeleditor-text" root={root}/>
          <OptionColor label="Main Color" propName="--color-labeleditor-main" root={root}/>
        </OptionGroup>

        <OptionGroup title={I18N.toString("GENERAL_TITLE")} label={I18N.toString("CATEGORY_COLOR")}>
          <OptionColor label="Viewport Error Color" propName="--color-viewport-error" root={root}/>
          <OptionColor label="Viewport Warning Color" propName="--color-viewport-warning" root={root}/>
          <OptionColor label="Highlight Select Color" propName="--color-highlight-select" root={root}/>
        </OptionGroup>

        <hr/>

        <div className="panel-checkbox">
          <input id="option-skipwelcome" type="checkbox" checked={this.state.skipWelcome}
          onChange={(e) => {
            const result = e.target.checked;
            this.setState({skipWelcome: e.target.checked});
            Storage.saveToLocalStorage("skipWelcome", result);
          }}/>
          <label htmlFor="option-skipwelcome">{I18N.toString("SKIP_WELCOME_PAGE")}</label>
        </div>

        <div className="panel-checkbox">
          <input id="option-altinput" type="checkbox" value={this.props.controller.getMouseActionMode()}
            onChange={(e) => {
              this.props.controller.setMouseActionMode(e.target.checked);
            }}/>
          <label htmlFor="option-altinput">{I18N.toString("SWAP_INPUT_CONTROLS")}</label>
        </div>

        <button className="panel-button" onClick={(e) => {
          Config._resetOnLoad = true;
          //TODO: This is currently only used to make sure a config file is saved
          //TODO: Remove this when there is a 'save config' button!
          saveConfig();

          location.reload();
        }}>{I18N.toString("RESET_TO_DEFAULT")}</button>


      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OptionsPanel;
