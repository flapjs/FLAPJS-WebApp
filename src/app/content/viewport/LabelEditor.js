import React from 'react';
import './LabelEditor.css';

import Config from 'config.js';
import { EMPTY } from 'machine/Symbols.js';

//TODO: This is equivalent to 4em for toolbar height
const LABEL_OFFSET_Y = -64;
const EDITOR_OFFSET_Y = -36;
const DELETE_KEY = 8;
const DELETE_FORWARD_KEY = 46;

const RECOMMENDED_SYMBOLS = ["0", "1"];
const DEFAULT_SYMBOLS = [EMPTY];

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

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
  }

  openEditor(targetEdge, defaultText=null, replace=true, callback=null)
  {
    this.setState((prev, props) => {
      return {
        target: targetEdge,
        callback: callback
      };
    });

    this.inputElement.value = defaultText || targetEdge.label;
    this.parentElement.focus();

    if (replace)
    {
      this.inputElement.select();
    }
    else
    {
      this.inputElement.focus();
    }
  }

  closeEditor(saveOnExit=false)
  {
    //Save data
    if (this.state.target !== null)
    {
      if (saveOnExit)
      {
        let value = this.inputElement.value;
        if (!value) value = EMPTY;

        this.state.target.setLabel(value);
      }
      else
      {
        if (!this.state.target.label)
        {
          this.state.target.setLabel(EMPTY);

          //Delete it since it is not a valid edge
          this.props.graph.deleteEdge(this.state.target);
        }
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

  onContextMenu(e)
  {
    e.preventDefault();
    e.stopPropagation();
  }

  onKeyDown(e)
  {
    if (e.keyCode === Config.DELETE_KEY)
    {
      const input = this.inputElement;
      const index = input.selectionStart - 1;
      //If delete commas, delete the associated element too
      if (input.value.charAt(index) === ',')
      {
        input.setSelectionRange(index, index);
      }
      //Continue to processs delete event
    }
    else if (e.keyCode === Config.DELETE_FORWARD_KEY)
    {
      const input = this.inputElement;
      const index = input.selectionStart;
      //If delete commas, delete the associated element too
      if (input.value.charAt(index) === ',')
      {
        input.setSelectionRange(index + 1, index + 1);
      }
      //Continue to processs delete event
    }
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

  onInputChange(e)
  {
    //Maintain proper format
    const target = e.target;
    //Save cursor position for later
    const prevStart = target.selectionStart;
    const prevEnd = target.selectionEnd;
    const prevLength = target.value.length;

    target.value = this.props.machineBuilder.formatAlphabetString(target.value, true);

    if (prevStart < prevLength)
    {
      //Set cursor back to where it was
      target.setSelectionRange(prevStart, prevEnd);
    }
  }

  appendSymbol(symbol)
  {
    const string = this.inputElement.value;
    let result = "";

    //Make sure that the transition does not already have symbol
    const symbols = string.split(",");
    if (!symbols.includes(symbol))
    {
      //Replace the selected text
      if (this.inputElement.selectionStart === 0 &&
        this.inputElement.selectionEnd === string.length)
      {
        result = symbol;
      }
      else
      {
        symbols.push(symbol);
        //symbols.sort();
        result = symbols.join(",");
      }

      this.inputElement.value = result;
    }

    //Redirect user to input field after button click
    this.inputElement.focus();
  }

  render()
  {
    const inputController = this.props.inputController;
    const targetStyle = {
      visibility: "hidden"
    };

    const target = this.state.target;
    if (target)
    {
      targetStyle.visibility = "visible";

      //Assumes target is an instance of Edge
      const center = target.getCenterPoint();
      const screen = getScreenPosition(this.props.screen,
        center.x + inputController.pointer.offsetX,
        center.y + inputController.pointer.offsetY);
      const x = screen.x;
      const y = screen.y + LABEL_OFFSET_Y + EDITOR_OFFSET_Y;
      const offsetX = -(this.parentElement.offsetWidth / 2);
      const offsetY = -(this.parentElement.offsetHeight / 2);

      targetStyle.top = (y + offsetY) + "px";
      targetStyle.left = (x + offsetX) + "px";
    }

    const usedAlphabet = this.props.machineBuilder.getMachine().getAlphabet();

    return <div className="bubble" id="label-editor" ref={ref=>this.parentElement=ref}
      tabIndex={"0"/*This is to allow div's to focus/blur*/}
      style={targetStyle}
      onContextMenu={this.onContextMenu}
      onFocus={(e)=>{
        //HACK: delete the timer that will exit labelEditor
        clearTimeout(this._timer);
      }}
      onBlur={(e)=>{
        //HACK: start the timer that will exit labelEditor if not return focus
        this._timer = setTimeout(() => this.closeEditor(true), 10);
      }}>
      <input className="label-editor-input" type="text" ref={ref=>this.inputElement=ref}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onChange={this.onInputChange}/>
      <div className="label-editor-tray">
        {
          usedAlphabet &&
          <span className="label-editor-tray-used">
            {
              usedAlphabet.map((e, i) => {
                if (e.length < 1) return null;
                return <button key={i} onClick={ev=>this.appendSymbol(e)}>{e}</button>
              })
            }
          </span>
        }
        <span className="label-editor-tray-default">
          {
            usedAlphabet &&
            usedAlphabet.length <= 1 &&
            RECOMMENDED_SYMBOLS.map((e, i) => {
              return <button key={i} onClick={ev=>this.appendSymbol(e)}>
              {e}
              </button>;
            })
          }
          {
            DEFAULT_SYMBOLS.map((e, i) => {
              return <button key={i} onClick={ev=>this.appendSymbol(e)}>
              {e}
              </button>;
            })
          }
        </span>
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
