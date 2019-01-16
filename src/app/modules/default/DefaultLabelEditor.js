import React from 'react';
import './DefaultLabelEditor.css';

import GraphEdge from 'graph/GraphEdge.js';

import Config from 'config.js';
import { SYMBOL_SEPARATOR, EMPTY_CHAR } from 'modules/fsa/graph/FSAEdge.js';

import FormattedInput from 'system/formattedinput/FormattedInput.js';

//TODO: This is equivalent to 4em for toolbar height
const LABEL_OFFSET_Y = -64;
const EDITOR_OFFSET_Y = -36;
const DELETE_KEY = 8;
const DELETE_FORWARD_KEY = 46;

const RECOMMENDED_SYMBOLS = ["0", "1"];
const DEFAULT_SYMBOLS = [EMPTY_CHAR];
const DELETE_ON_EMPTY = true;

class DefaultLabelEditor extends React.Component
{
  constructor(props)
  {
    super(props);

    this.parentElement = null;
    this.inputElement = null;

    //HACK: this is so if the click is focused back to the label editor, then it will NOT close
    this._timer = null;
    this._prevValue = "";

    this.state = {
      target: null,
      callback: null
    };

    this.onContextMenu = this.onContextMenu.bind(this);
    this.onFormat = this.onFormat.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  openEditor(targetElement, defaultText=null, replace=true, callback=null)
  {
    //If not yet initilized, ignore any editor access
    if (!this.inputElement || !this.parentElement)
    {
      throw new Error("Trying to open editor that has not yet mounted");
    }

    this.setState((prev, props) => {
      return {
        target: targetElement,
        callback: callback
      };
    });

    const targetLabel = targetElement instanceof GraphEdge ?
      targetElement.getEdgeLabel() :
      targetElement.getNodeLabel();
    this.inputElement.resetValue(targetLabel, () => {
      if (defaultText) this.inputElement.setValue(defaultText);

      this._prevValue = targetLabel;
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
    const targetElement = this.state.target;
    if (targetElement !== null)
    {
      if (saveOnExit)
      {
        let value = this.inputElement.value;
        if (targetElement instanceof GraphEdge)
        {
          targetElement.setEdgeLabel(value);
        }
        else
        {
          targetElement.setNodeLabel(value);
        }
      }
      else
      {
        const targetLabel = targetElement instanceof GraphEdge ?
          targetElement.getEdgeLabel() :
          targetElement.getNodeLabel();
        if (!targetLabel)
        {
          //Make sure its empty (and let edge handle default labels)
          if (targetElement instanceof GraphEdge)
          {
            targetElement.setEdgeLabel(null);
          }
          else
          {
            targetElement.setNodeLabel(null);
          }

          //Delete it since it is not a valid element
          if (DELETE_ON_EMPTY)
          {
            if (targetElement instanceof GraphEdge)
            {
              this.props.graphController.getGraph().deleteEdge(targetElement);
            }
            else
            {
              this.props.graphController.getGraph().deleteNode(targetElement)
            }
          }
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
    this.inputElement.appendValue(symbol, SYMBOL_SEPARATOR);
    this.inputElement.focus(false);
  }

  onSubmit(newValue, prevValue)
  {
    //this._prevValue = newValue;
    //If the value has changed or the value remained empty...
    if (newValue != prevValue)
    {
      //this.closeEditor(true);
    }
    else
    {
      //TODO: This was commented out for some reason...
      //Will close due to timer...
      this.closeEditor(false);
    }
  }

  onFormat(value)
  {
    return this.props.graphController.getGraphLabeler().getEdgeLabelFormatter().call(null, value);
  }

  render()
  {
    const inputController = this.props.inputController;
    const viewport = inputController.getInputAdapter().getViewport();
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
      const center = target instanceof GraphEdge ?
        target.getCenterPoint() :
        target/* GraphNode themselves have x/y attribs */;
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
        captureOnExit={"none"}
        multiline={true}/>
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

export default DefaultLabelEditor;
