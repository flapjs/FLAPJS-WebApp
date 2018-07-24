import React from 'react';

import * as Config from 'config.js';

import './LabelEditor.css';

//TODO: This is equivalent to 4em for toolbar height
const LABEL_OFFSET_Y = -64;
const EDITOR_OFFSET_Y = -36;

class LabelEditor extends React.Component
{
  constructor(props)
  {
    super(props);

    this.parentElement = React.createRef();
    this.inputElement = React.createRef();

    this.state = {
      target: null,
      callback: null
    };
  }

  openEditor(targetEdge, defaultText=null, callback=null)
  {
    this.setState((prev, props) => {
      return {
        target: targetEdge,
        callback: callback
      };
    });

    this.inputElement.value = defaultText || targetEdge.label;
    this.inputElement.focus();
    this.inputElement.select();
  }

  closeEditor(saveOnExit=false)
  {
    //Save data
    if (this.state.target !== null)
    {
      if (saveOnExit)
      {
        this.state.target.setLabel(this.inputElement.value);
      }
      this.state.target = null;

      if (this.state.callback) this.state.callback();
    }

    //Reset label editor
    this.inputElement.blur();
  }

  isEditorOpen()
  {
    return this.state.target !== null;
  }

  onKeyUp(e)
  {
    if (e.keyCode == Config.SUBMIT_KEY)
    {
      this.closeEditor(true);
    }
    else if (e.keyCode == Config.CLEAR_KEY)
    {
      this.closeEditor(false);
    }
  }

  onBlur(e)
  {
    this.closeEditor(false);
  }

  render()
  {
    const targetStyle = {
      visibility: "hidden"
    };

    const target = this.state.target;
    if (target)
    {
      targetStyle.visibility = "visible";
      const screen = getScreenPosition(this.props.screen, target.x, target.y);
      const x = screen.x;
      const y = screen.y + LABEL_OFFSET_Y + EDITOR_OFFSET_Y;
      const offsetX = -(this.parentElement.offsetWidth / 2);
      const offsetY = -(this.parentElement.offsetHeight / 2);

      targetStyle.top = (y + offsetY) + "px";
      targetStyle.left = (x + offsetX) + "px";
    }

    return <span className="bubble" id="label-editor" ref={ref=>this.parentElement=ref}
      style={targetStyle}>
      <input className="label-editor-input" type="text" ref={ref=>this.inputElement=ref}
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}/>
      <div className="label-editor-tray">
        <button>BUTTON</button>
        <button>BUTTON</button>
        <button>BUTTON</button>
        <button>BUTTON</button>
        <button>BUTTON</button>
        <button>BUTTON</button>
      </div>
    </span>;
  }
}

function getScreenPosition(svg, x, y)
{
  const ctm = svg.getScreenCTM();
  return {
    x: (x * ctm.a) + ctm.e,
    y: (y * ctm.d) + ctm.f
  };
}

export default LabelEditor;
