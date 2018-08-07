import React from 'react';
import './TestingInput.css';

import IconButton from 'icons/IconButton.js';
import AddIcon from 'icons/AddIcon.js';
import RemoveIcon from 'icons/RemoveIcon.js';

import StatusButton from './StatusButton.js';

const PLACEHOLDER_TEXT = "Test string";

class TestingInput extends React.Component
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

    this.onClick = this.onClick.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onClick(e)
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
        placeholder={PLACEHOLDER_TEXT}
        onChange={this.onValueChange}
        onFocus={(e)=>e.target.select()}/>

      <IconButton className="test-input-addremove" onClick={this.onClick}>
        {this.props.placeholder ? <AddIcon/> : <RemoveIcon/>}
      </IconButton>
    </div>
  }
}

export default TestingInput;
