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
  }

  onFocus(e)
  {
    const target = e.target;
    this.setState({ value: this.props.label, error: false },
      ()=>target.select());

    //Call any listening focus
    if (this.props.onFocus) this.props.onFocus(e);
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

    //Call any listening blurs
    if (this.props.onBlur) this.props.onBlur(e);
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
    const isCustom = this.props.src.hasCustomLabel();
    const value = this.state.value != null ? this.state.value : this.props.label;
    return <div className="statetag-container"
      style={{
        background: value.length > 0 ?
          isCustom ? Config.DEFAULT_CUSTOM_BACKGROUND : Config.DEFAULT_BACKGROUND :
          Config.ERROR_BACKGROUND
      }} draggable="true">
      <input type="text" className={"statetag-input" + (this.props.accept ? " accept" : "")} spellCheck="false"
        style={{
          width: value.length + "ch",
          color: this.state.value ?
            this.state.error ?
              Config.ERROR_COLOR : Config.EDIT_COLOR :
              isCustom ? Config.DEFAULT_CUSTOM_COLOR : Config.DEFAULT_COLOR
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
