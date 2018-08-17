import React from 'react';
import '../Panel.css';
import './OptionsPanel.css';

import Config from 'config.js';
import { saveConfig } from 'config.js';

import OptionGroup from './OptionGroup.js';
import OptionHotkey from './OptionHotkey.js';
import OptionColor from './OptionColor.js';

class OptionsPanel extends React.Component
{
  constructor(props)
  {
    super(props)

    this.container = React.createRef();
  }

  render()
  {
    const root = document.getElementById("root");
    return <div className="panel-container" id="option" ref={ref=>this.container=ref}>
      <div className="panel-title">
        <h1>Option</h1>
      </div>
      <div className="panel-content">

        <button className="panel-button">Change Theme...</button>

        <hr/>

        <OptionGroup title="Workspace" label="Shortcuts">
          <OptionHotkey label="Save Machine File" keyName="Ctrl + S"/>
          <OptionHotkey label="Undo Action" keyName="Ctrl + Z"/>
          <OptionHotkey label="Redo Action" keyName="Ctrl + Shift + Z"/>
          <OptionHotkey label="Export to PNG" keyName="Ctrl + P"/>
        </OptionGroup>

        <OptionGroup title="Testing" label="Shortcuts">
          <OptionHotkey label="Submit Change" keyName="Enter"/>
          <OptionHotkey label="Cancel Change" keyName="Escape"/>
        </OptionGroup>

        <OptionGroup title="Toolbar" label="Colors">
          <OptionColor label="Main Color" propName="--color-toolbar-main" root={root}
            dark="true"/>
          <OptionColor label="Accent Color" propName="--color-toolbar-accent" root={root}
            dark="true"/>
          <OptionColor label="Text Color" propName="--color-toolbar-text" root={root}
            invert="true"/>
        </OptionGroup>

        <OptionGroup title="Drawer" label="Colors">
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

        <OptionGroup title="Testing" label="Colors">
          <OptionColor label="Success Color" propName="--color-testing-success" root={root}/>
          <OptionColor label="Failure Color" propName="--color-testing-failure" root={root}/>
          <OptionColor label="Working Color" propName="--color-testing-working" root={root}/>
          <OptionColor label="Text Color" propName="--color-testing-text" root={root}/>
        </OptionGroup>

        <OptionGroup title="Notification" label="Colors">
          <OptionColor label="Text Color" propName="--color-notification-text" root={root}/>
          <OptionColor label="Info Color" propName="--color-notification-info" root={root}
            dark="true"/>
          <OptionColor label="Error Color" propName="--color-notification-error" root={root}
            dark="true"/>
          <OptionColor label="Warning Color" propName="--color-notification-warning" root={root}
            dark="true"/>
        </OptionGroup>

        <OptionGroup title="Graph" label="Colors">
          <OptionColor label="Node Color" propName="--color-graph-node" root={root}/>
          <OptionColor label="Text Color" propName="--color-workspace-text" root={root}/>
          <OptionColor label="Main Color" propName="--color-workspace-main" root={root}/>
          <OptionColor label="Label Editor Main Color" propName="--color-labeleditor-main" root={root}/>
        </OptionGroup>

        <OptionGroup title="Label Editor" label="Colors">
          <OptionColor label="Text Color" propName="--color-labeleditor-text" root={root}/>
          <OptionColor label="Main Color" propName="--color-labeleditor-main" root={root}/>
        </OptionGroup>

        <OptionGroup title="General" label="Colors">
          <OptionColor label="Viewport Error Color" propName="--color-viewport-error" root={root}/>
          <OptionColor label="Highlight Select Color" propName="--color-highlight-select" root={root}/>
        </OptionGroup>

        <hr/>

        <div className="panel-checkbox">
          <input id="option-altinput" type="checkbox" disabled="true"/>
          <label htmlFor="option-altinput">Swap Input Controls</label>
        </div>

        <button className="panel-button" onClick={(e) => {
          Config._resetOnLoad = true;
          //TODO: This is currently only used to make sure a config file is saved
          //TODO: Remove this when there is a 'save config' button!
          saveConfig();

          location.reload();
        }}>Reset to default</button>


      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OptionsPanel;
