import React from 'react';

import * as Config from 'config.js';

import './LabelEditor.css';

//TODO: Figure out why this is negative sixty five...
const LABEL_OFFSET_Y = -65;

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
      if (saveOnExit) this.state.target.label = this.inputElement.value;
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
      const screen = getScreenPosition(this.props.workspace, target.x, target.y);
      const x = screen.x;
      const y = screen.y + LABEL_OFFSET_Y;//HACK: WHERE IS THIS OFFSET FROM???
      const offsetX = -(this.parentElement.offsetWidth / 2);
      const offsetY = -(this.parentElement.offsetHeight / 2);

      targetStyle.top = (y + offsetY) + "px";
      targetStyle.left = (x + offsetX) + "px";
    }

    return <span id="label-editor" ref={ref=>this.parentElement=ref}
      style={targetStyle}>
      <input type="text" ref={ref=>this.inputElement=ref}
        onKeyUp={this.onKeyUp.bind(this)}
        onBlur={this.onBlur.bind(this)}/>
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
