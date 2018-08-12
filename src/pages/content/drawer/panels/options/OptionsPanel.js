import React from 'react';
import '../Panel.css';
import './OptionsPanel.css';

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

        <div className="option-group">
          <div className="option-header">
            <label>Workspace</label>
            <label>(Shortcuts)</label>
          </div>
          <div className="option-content">
            <OptionHotkey label="Save Machine File" keyName="Ctrl + S"/>
            <OptionHotkey label="Undo Action" keyName="Ctrl + Z"/>
            <OptionHotkey label="Redo Action" keyName="Ctrl + Shift + Z"/>
            <OptionHotkey label="Export to PNG" keyName="Ctrl + P"/>
          </div>
        </div>

        <div className="option-group">
          <div className="option-header">
            <label>Testing Panel</label>
            <label>(Shortcuts)</label>
          </div>
          <div className="option-content">
            <OptionHotkey label="Submit Change" keyName="Enter"/>
            <OptionHotkey label="Cancel Change" keyName="Escape"/>
          </div>
        </div>

        <div className="option-group">
          <div className="option-header">
            <label>Toolbar</label>
            <label>(Colors)</label>
          </div>
          <div className="option-content">
            <OptionColor label="Main Color" propName="--color-toolbar-main" root={root}
              dark="true"/>
            <OptionColor label="Accent Color" propName="--color-toolbar-accent" root={root}
              dark="true"/>
            <OptionColor label="Text Color" propName="--color-toolbar-text" root={root}
              invert="true"/>
          </div>
        </div>
      </div>

      <hr/>

      <div className="panel-checkbox">
        <input id="option-altinput" type="checkbox" disabled="true"/>
        <label htmlFor="option-altinput">Swap Input Controls</label>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OptionsPanel;
