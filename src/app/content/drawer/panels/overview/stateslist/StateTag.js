import React from 'react';
import './StateTag.css';

import Config from 'config.js';

class StateTag extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      value: null,
      error: false
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragStart(e)
  {
    //Drag all of it
    e.target.select();
  }

  onDrop(e)
  {
    const graph = this.props.graphController.getGraph();
    const nodeIndex = graph.getNodeIndex(this.props.src);
    const otherIndex = graph.getNodeIndexByLabel(e.dataTransfer.getData("text"));

    //Swap
    this.props.graphController.swapNodeByIndex(nodeIndex, otherIndex);

    e.preventDefault();
  }

  onFocus(e)
  {
    const target = e.target;
    this.setState({ value: this.props.label, error: false }, () => {
      target.select()
    });

    //Call any listening focus
    if (this.props.onFocus) this.props.onFocus(e);
  }

  onBlur(e)
  {
    const newLabel = this.state.value;

    //The value is already processed, abort
    if (newLabel != null)
    {
      const node = this.props.src;
      const graph = this.props.graphController.getGraph();
      if (newLabel.length > 0)
      {
        const result = graph.getNodeByLabel(newLabel);
        if (!result)
        {
          //Valid! Rename it!
          this.props.graphController.renameNode(node, newLabel);
        }
        else
        {
          //Found something already named that! Ignore!
        }
      }
      else
      {
        //Delete!
        graph.deleteNode(this.props.src);
      }

      this.setState({ value: null, error: false });

      //Call any listening blurs
      if (this.props.onBlur) this.props.onBlur(e);
    }
  }

  onKeyDown(e)
  {
    if (e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY)
    {
      e.preventDefault();
    }
  }

  onKeyUp(e)
  {
    if (e.keyCode === Config.SUBMIT_KEY)
    {
      e.target.blur();
    }
    else if (e.keyCode === Config.CLEAR_KEY)
    {
      const target = e.target;
      this.setState({ value: null, error: false}, () => {
        target.blur();
      });
    }
  }

  onValueChange(e)
  {
    const graph = this.props.graphController.getGraph();
    const value = e.target.value.trim();
    let error = false;
    if (value.length > 0)
    {
      const node = graph.getNodeByLabel(value);
      if (node != null && node != this.props.src)
      {
        error = true;
      }
    }

    this.setState({
      value: value,
      error: error
    });
  }

  render()
  {
    const isCustom = this.props.src.hasCustomLabel();
    const value = this.state.value != null ? this.state.value : this.props.label;
    return <div className={"statetag-container" +
      (isCustom ? " customtag" : "") +
      (value.length == 0 ? " emptytag" : "") +
      (this.state.value && this.state.error ? " errortag" : "")}>
      <input type="text" className={(this.props.accept ? " accept" : "")}
        spellCheck="false"
        draggable="true"
        style={{width: value.length + "ch"}}
        value={value}
        onChange={this.onValueChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onDragStart={this.onDragStart}
        onDrop={this.onDrop}/>
    </div>;
  }
}

export default StateTag;
