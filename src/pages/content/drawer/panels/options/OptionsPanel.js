import React from 'react';
import '../Panel.css';
import './OptionsPanel.css';

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
        <div className="hotkey-list">
          <div className="hotkey-category">Workspace</div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Save Machine File</label>
            <span className="hotkey-input">Ctrl + S</span>
          </div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Undo</label>
            <span className="hotkey-input">Ctrl + Z</span>
          </div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Redo</label>
            <span className="hotkey-input">Ctrl + Shift + Z</span>
          </div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Upload File</label>
            <span className="hotkey-input">Ctrl + U</span>
          </div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Export to PNG</label>
            <span className="hotkey-input">Ctrl + E</span>
          </div>

          <div className="hotkey-category">Testing Panel</div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Add and Run Test</label>
            <span className="hotkey-input">Enter</span>
          </div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Next Test</label>
            <span className="hotkey-input">Down</span>
          </div>
          <div className="hotkey-container">
            <label className="hotkey-desc">Previous Test</label>
            <span className="hotkey-input">Up</span>
          </div>
        </div>

        <hr/>

        <div className="panel-checkbox">
          <input id="option-altinput" type="checkbox" disabled="true"/>
          <label htmlFor="option-altinput">Swap Input Controls</label>
        </div>
        <div className="panel-checkbox">
          <input id="option-color" type="color"
            onChange={function(e) {
              const value = e.target.value;
              root.style.setProperty("--color-toolbar-main", value);
            }}/>
          <label htmlFor="option-color">Primary Color</label>
        </div>
        <div className="panel-checkbox">
          <input id="option-color2" type="color" defaultValue="#FF00FF"/>
          <label htmlFor="option-color2">Accent Color</label>
        </div>
      </div>

      <div className="panel-bottom"></div>
    </div>;
  }
}

export default OptionsPanel;
