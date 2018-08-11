import React from 'react';
import './TestInput.css';

import Config from 'config.js';

import IconButton from 'icons/IconButton.js';
import AddIcon from 'icons/AddIcon.js';
import RemoveIcon from 'icons/RemoveIcon.js';

import StatusButton from './StatusButton.js';

class TestInput extends React.Component
{
  constructor(props)
  {
    super(props);

    this.inputElement = React.createRef();

    this.state = {
      src: this.props.src || {
        value: "",
        result: 0,
        dirty: true
      }
    };

    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onSubmitClick(e)
  {
    if (this.props.placeholder)
    {
      //Add test input to list
      this.props.tester.addTestInput(this.state.src.value);

      this.inputElement.focus();
      this.inputElement.select();
    }
    else
    {
      //Remove test input from list
      this.props.tester.removeTestInputByIndex(this.props.index);
    }
  }

  onValueChange(e)
  {
    const value = e.target.value;
    this.state.src.value = value;
    this.state.src.dirty = true;
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
      //Add input if placeholder and Run
      if (this.props.placeholder)
      {
        const tester = this.props.tester;
        tester.testPlaceholder();
        //Add test input to list
        const newTest = tester.addTestInput(this.state.src.value);
        //Save result to new test
        newTest.result = tester.placeholder.result;
        newTest.dirty = false;

        //Select everything again
        this.inputElement.select();
      }
      //Otherwise just run it
      else
      {
        this.props.tester.testByIndex(this.props.index);

        //Select everything again
        this.inputElement.select();
      }
    }
    else if (e.keyCode === Config.CLEAR_KEY)
    {
      e.target.blur();
    }
  }

  render()
  {
    return <div className={"test-input-container" +
      (this.props.placeholder ? " test-input-placeholder" : "")}>

      <StatusButton active={!this.state.src.dirty} mode={this.state.src.result}
        onClick={()=>{
          if (this.props.placeholder)
          {
            this.props.tester.testPlaceholder();
          }
          else
          {
            this.props.tester.testByIndex(this.props.index);
          }
        }}/>

      <input ref={ref=>this.inputElement=ref} className="test-input-field"
        value={this.state.src.value}
        placeholder={Config.PLACEHOLDER_TEXT}
        onChange={this.onValueChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onFocus={(e)=>e.target.select()}/>

      <IconButton className="test-input-addremove" onClick={this.onSubmitClick}>
        {this.props.placeholder ? <AddIcon/> : <RemoveIcon/>}
      </IconButton>
    </div>
  }
}

export default TestInput;
