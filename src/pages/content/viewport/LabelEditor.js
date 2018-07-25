import React from 'react';

import * as Config from 'config.js';

import './LabelEditor.css';

//TODO: This is equivalent to 4em for toolbar height
const LABEL_OFFSET_Y = -64;
const EDITOR_OFFSET_Y = -36;

const DEFAULT_SYMBOLS = ["0", "1",
  "\u03B5",//epsilon
  "\u03BB"];//lambda

class LabelEditor extends React.Component
{
  constructor(props)
  {
    super(props);

    this.parentElement = React.createRef();
    this.inputElement = React.createRef();

    //HACK: this is so if the click is focused back to the label editor, then it will NOT close
    this._timer = null;

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
    this.parentElement.focus();
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

  appendSymbol(symbol)
  {
    let str = this.inputElement.value.trim();
    if (str && str[str.length - 1] !== ',')
    {
      str += ",";
    }
    str += symbol;
    this.inputElement.value = str;

    //Redirect user to input field after button click
    this.inputElement.focus();
  }

  render()
  {
    const controller = this.props.controller;
    const targetStyle = {
      visibility: "hidden"
    };

    const target = this.state.target;
    if (target)
    {
      targetStyle.visibility = "visible";
      const screen = getScreenPosition(this.props.screen,
        target.x + controller.pointer.offsetX,
        target.y + controller.pointer.offsetY);
      const x = screen.x;
      const y = screen.y + LABEL_OFFSET_Y + EDITOR_OFFSET_Y;
      const offsetX = -(this.parentElement.offsetWidth / 2);
      const offsetY = -(this.parentElement.offsetHeight / 2);

      targetStyle.top = (y + offsetY) + "px";
      targetStyle.left = (x + offsetX) + "px";
    }

    const usedAlphabet = this.props.graph.toFSA().getAlphabet();

    return <div className="bubble" id="label-editor" ref={ref=>this.parentElement=ref}
      style={targetStyle}

      onFocus={(e)=>{
        //HACK: delete the timer that will exit labelEditor
        clearTimeout(this._timer);
      }}
      onBlur={(e)=>{
        //HACK: start the timer that will exit labelEditor if not return focus
        this._timer = setTimeout(() => this.closeEditor(false), 10);
      }}>
      <input className="label-editor-input" type="text" ref={ref=>this.inputElement=ref}
        onKeyUp={this.onKeyUp.bind(this)}/>
      <div className="label-editor-tray">
        <span className="label-editor-tray-used">
          {
            usedAlphabet.map((e, i) => {
              return <button key={i} onClick={ev=>this.appendSymbol(e)}>{e}</button>
            })
          }
        </span>
        {
          usedAlphabet.length <= 1 &&
          <span className="label-editor-tray-default">
            {
              DEFAULT_SYMBOLS.map((e, i) => {
                return <button key={i} onClick={ev=>this.appendSymbol(e)}>
                {e}
                </button>;
              })
            }
          </span>
        }
      </div>
    </div>;
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
