import React from 'react';
import './LabelEditor.css';

import Config from 'config.js';
import { EMPTY } from 'machine/Symbols.js';

import FormattedInput from './FormattedInput.js';

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

    this.parentElement = null;
    this.inputElement = null;

    //HACK: this is so if the click is focused back to the label editor, then it will NOT close
    this._timer = null;

    this.state = {
      target: null,
      callback: null
    };

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onFormat = this.onFormat.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  openEditor(targetEdge, defaultText=null, replace=true, callback=null)
  {
    //If not yet initilized, ignore any editor access
    if (!this.inputElement || !this.parentElement)
    {
      throw new Error("Trying to open editor that has not yet mounted");
    }

    this.setState((prev, props) => {
      return {
        target: targetEdge,
        callback: callback
      };
    });

    this.inputElement.resetValue(targetEdge.label, () => {
      if (defaultText) this.inputElement.setValue(defaultText);

      this.parentElement.focus();
      this.inputElement.focus(replace);
    });
  }

  closeEditor(saveOnExit=false)
  {
    //If not yet initilized, ignore any editor access
    if (!this.inputElement || !this.parentElement)
    {
      throw new Error("Trying to open editor that has not yet mounted");
    }

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
          this.props.graphController.getGraph().deleteEdge(this.state.target);
        }
      }

      this.setState({target: null});

      if (this.state.callback) this.state.callback();
    }

    //Reset label editor
    this.inputElement.blur();
  }

  hasFocus()
  {
    return this.inputElement.hasFocus();
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

  appendSymbol(symbol)
  {
    this.inputElement.appendValue(symbol);
    this.inputElement.focus();
  }

  onSubmit(newValue, prevValue)
  {
    //If the value has changed or the value remained empty...
    if (newValue != prevValue)
    {
      this.closeEditor(true);
    }
    else
    {
      this.closeEditor(false);
    }
  }

  onFormat(value)
  {
    return this.props.machineController.getMachineBuilder().formatAlphabetString(value, true);
  }

  render()
  {
    const inputController = this.props.inputController;
    const viewport = inputController.getViewport();
    const graphController = this.props.graphController;//This is used in closeEditor()
    const machineController = this.props.machineController;//This is also used in callbacks
    const screen = this.props.screen;

    const targetStyle = {
      visibility: "hidden"
    };

    const target = this.state.target;

    if (target)
    {
      targetStyle.visibility = "visible";

      //Assumes target is an instance of Edge
      const center = target.getCenterPoint();
      const screenPos = transformViewToScreen(screen,
        center.x + viewport.getOffsetX(),
        center.y + viewport.getOffsetY());
      const x = screenPos.x;
      const y = screenPos.y + LABEL_OFFSET_Y + EDITOR_OFFSET_Y;
      const offsetX = -(this.parentElement.offsetWidth / 2);
      const offsetY = -(this.parentElement.offsetHeight / 2);

      targetStyle.top = (y + offsetY) + "px";
      targetStyle.left = (x + offsetX) + "px";
    }

    const usedAlphabet = machineController.getMachineBuilder().getMachine().getAlphabet();

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
      <FormattedInput className="label-editor-input" ref={ref=>this.inputElement=ref}
        formatter={this.onFormat}
        onSubmit={this.onSubmit}
        saveOnExit={true}/>
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

function transformViewToScreen(svg, x, y)
{
  const ctm = svg.getScreenCTM();
  return {
    x: (x * ctm.a) + ctm.e,
    y: (y * ctm.d) + ctm.f
  };
}

export default LabelEditor;
