import React from 'react';
import './SetEditor.css';

import Config from 'config.js';

const TARGET_PLACEHOLDER = ' ';//Must be whitespace in order to be trimmed on input
const SEPARATOR = ',';

class SetEditor extends React.Component
{
  constructor(props)
  {
    super(props);

    this.inputElement = React.createRef();
    this._ignoreUpdates = false;

    const initialValue = this.getUpdatedValues(true);
    this.state = {
      prevValue: initialValue,
      value: initialValue,
      lastElementIndex: 0
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onFocus(e)
  {
    //Remove all spacing with commas for editing...
    this.updateValues(false);
  }

  onBlur(e)
  {
    //Apply changes
    const src = this.props.src;
    const srcLength = src.length;

    const getElementID = this.props.getElementID;
    const onAdd = this.props.onAdd;
    const onRemove = this.props.onRemove;
    const onRename = this.props.onRename;

    const inputValue = this.state.value;

    const renameCache = [];
    const destroyCache = [];
    const createCache = [];

    //result should be guaranteed to have at least existing separators
    const values = inputValue.split(SEPARATOR);
    if (values.length < srcLength)
    {
      throw new Error("Missing appropriate number of separators for elements.");
    }

    for(let i = 0; i < srcLength; ++i)
    {
      const prevElement = src[i];
      const value = values[i].trim();

      //Check if trying to remove
      if (!value || value == TARGET_PLACEHOLDER)
      {
        destroyCache.push(prevElement);
      }
      //Error check!
      else if (values.indexOf(value, i + 1) != -1)
      {
        //Return out, cause input was invalid
        this.resetValueToPrevious();
        return;
      }
      //Check if trying to rename
      else if (value != getElementID(prevElement))
      {
        renameCache.push({
          target: prevElement,
          value: value
        });
      }
      else
      {
        //Just ignore it. It's still the same.
      }
    }

    //Create remaining
    let length = values.length;
    for(let i = srcLength; i < length; ++i)
    {
      const value = values[i].trim();
      if (value.length <= 0) continue;
      if (values.indexOf(value, i + 1) != -1)
      {
        //Return out, cause input was invalid
        this.resetValueToPrevious();
        return;
      }

      createCache.push(value);
    }

    //All error checks should have been done and now alter the graph...

    this._ignoreUpdates = true;
    //Create all
    if (onAdd)
    {
      for(const e of createCache)
      {
        onAdd(e);
      }
    }

    //Destroy all
    if (onRemove)
    {
      for(const e of destroyCache)
      {
        onRemove(e);
      }
    }

    //Rename stuff
    if (onRename)
    {
      for(const e of renameCache)
      {
        onRename(e.target, e.value);
      }
    }
    this._ignoreUpdates = false;

    //Make sure it looks right
    //Add back all spacing with commas for viewing...
    this.updateValues(true);
  }

  onValueChange(e)
  {
    const value = e.target.value;
    const srcLength = this.props.src.length;

    let lastIndex = 0;

    //result should be guaranteed to have at least existing separators
    const result = value.split(SEPARATOR);
    if (result.length < srcLength)
    {
      throw new Error("Missing appropriate number of separators for elements.");
    }

    for(let i = 0; i < srcLength; ++i)
    {
      let target = result[i].trim();
      let targetLength = target.length;
      if (targetLength <= 0)
      {
        result[i] = TARGET_PLACEHOLDER;
        targetLength = TARGET_PLACEHOLDER.length;
      }
      else
      {
        result[i] = target;
      }
      lastIndex += targetLength + SEPARATOR.length;
    }

    let length = result.length;
    for(let i = srcLength; i < length; ++i)
    {
      const target = result[i].trim();
      result[i] = target;
    }

    //Return caret back to position
    const prevStart = e.target.selectionStart;
    const prevEnd = e.target.selectionEnd;
    e.target.value = result.join(SEPARATOR);
    e.target.setSelectionRange(prevStart, prevEnd);

    this.setState({
      value: e.target.value,
      lastElementIndex: lastIndex
    });
  }

  onKeyDown(e)
  {
    if (e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY)
    {
      e.preventDefault();
    }
    else if (e.keyCode === Config.DELETE_KEY)
    {
      const input = this.inputElement;
      const value = input.value;
      const index = input.selectionStart - 1;
      //If delete commas, don't delete the existing element separators
      if (index < this.state.lastElementIndex && value.charAt(index) === SEPARATOR)
      {
        input.setSelectionRange(index, index);
        e.preventDefault();
      }
      //Continue to processs delete event
    }
    else if (e.keyCode === Config.DELETE_FORWARD_KEY)
    {
      const input = this.inputElement;
      const value = input.value;
      const index = input.selectionStart;
      //If delete commas, don't delete the existing element separators
      if (index < this.state.lastElementIndex && value.charAt(index) === SEPARATOR)
      {
        input.setSelectionRange(index + 1, index + 1);
        e.preventDefault();
      }
      //Continue to processs delete event
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
      this.resetValueToPrevious(() => target.blur());
    }
  }

  getUpdatedValues(viewMode=false)
  {
    return this.props.src.map((e, i) => this.props.getElementID(e))
      .join(!viewMode ? SEPARATOR : SEPARATOR + " ");
  }

  updateValues(viewMode=false, callback=null)
  {
    if (this._ignoreUpdates) return;

    const value = this.getUpdatedValues(viewMode);
    this.setState((prev, props) => {
      return {
        prevValue: value,
        value: value
      };
    }, callback);
  }

  resetValueToPrevious(callback=null)
  {
    this.setState((prev, props) => {
      return {value: prev.prevValue};
    }, callback);
  }

  render()
  {
    return <span className="setedit-container">
      <input type="text" className="setedit-input" ref={ref=>this.inputElement=ref}
        value={this.state.value}
        spellCheck="false"
        onChange={this.onValueChange}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onFocus={this.onFocus}
        onBlur={this.onBlur}/>
    </span>
  }
}

export default SetEditor;
