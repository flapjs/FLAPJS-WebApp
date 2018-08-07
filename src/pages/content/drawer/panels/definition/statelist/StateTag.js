import React from 'react';
import './StateTag.css';

import Config from 'config.js';

const DEFAULT_COLOR = "gray";
const DEFAULT_CUSTOM_COLOR = "white";
const EDIT_COLOR = "rgba(255,255,255,0.1)";
const ERROR_COLOR = "rgba(255,0,0,0.7)";

const DEFAULT_BACKGROUND = "#4D4D4D";
const ERROR_BACKGROUND = "rgba(255,0,0,0.5)";

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
  }

  onFocus(e)
  {
    const target = e.target;
    this.setState({ value: this.props.label, error: false },
      ()=>target.select());
  }

  onBlur(e)
  {
    const newLabel = this.state.value;

    //The value is already processed, abort
    if (newLabel == null) return;

    const node = this.props.src;
    const graph = this.props.graph;
    if (newLabel.length > 0)
    {
      const result = graph.getNodeByLabel(newLabel);
      if (!result)
      {
        //Valid! Rename it!
        node.setCustomLabel(newLabel);
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
    const graph = this.props.graph;
    const value = e.target.value;
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
    const value = this.state.value != null ? this.state.value : this.props.label;
    return <div className="statetag-container"
      style={{
        background: value.length > 0 ? DEFAULT_BACKGROUND : ERROR_BACKGROUND
      }}>
      <input type="text" className={"statetag-input" + (this.props.accept ? " accept" : "")} spellCheck="false"
        style={{
          width: value.length + "ch",
          color: this.state.value ?
            this.state.error ?
              ERROR_COLOR : EDIT_COLOR :
              this.props.src.hasCustomLabel() ?
                DEFAULT_CUSTOM_COLOR : DEFAULT_COLOR
        }}
        value={value}
        onChange={this.onValueChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}/>
    </div>;
  }
}

export default StateTag;
