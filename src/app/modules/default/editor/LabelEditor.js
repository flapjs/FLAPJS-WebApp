import React from 'react';
import './LabelEditor.css';

import GraphEdge from 'graph/GraphEdge.js';
import FormattedInput from 'system/formattedinput/FormattedInput.js';

//TODO: This is equivalent to 4em for toolbar height
const LABEL_OFFSET_Y = -64;
const EDITOR_OFFSET_Y = -36;
const DELETE_KEY = 8;
const DELETE_FORWARD_KEY = 46;

function setLabelForTarget(target, value)
{
  if (target instanceof GraphEdge)
  {
    target.setEdgeLabel(value);
  }
  else
  {
    target.setNodeLabel(value);
  }
}

function getLabelForTarget(target)
{
  return target instanceof GraphEdge ?
    target.getEdgeLabel() :
    target.getNodeLabel();
}

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

    const edgeLabel = getLabelForTarget(targetEdge);
    this.inputElement.resetValue(edgeLabel, () => {
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
        setLabelForTarget(this.state.target, value);
      }
      else
      {
        if (!getLabelForTarget(this.state.target))
        {
          //Make sure its empty (and let edge handle default labels)
          setLabelForTarget(this.state.target, null);
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

  onSubmit(newValue, prevValue)
  {
    //If the value has changed or the value remained empty...
    if (newValue !== prevValue)
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

      let x = 0;
      let y = 0;

      if (target instanceof GraphEdge)
      {
        const center = target.getCenterPoint();
        x = center.x;
        y = center.y;
      }
      else
      {
        x = target.x;
        y = target.y;
      }

      const screenPos = transformViewToScreen(screen,
        x + viewport.getOffsetX(),
        y + viewport.getOffsetY());
      x = screenPos.x;
      y = screenPos.y + LABEL_OFFSET_Y + EDITOR_OFFSET_Y;
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
        multiline={true}
        captureOnExit={"none"}/>
      <div className="label-editor-tray">
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
