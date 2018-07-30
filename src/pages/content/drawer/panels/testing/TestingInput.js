import React from 'react';
import './TestingInput.css';

import AddRemoveIcon from './AddRemoveIcon.js';
import StatusIcon from './StatusIcon.js';

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

    this.onValueChange = this.onValueChange.bind(this);
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

      <StatusIcon active={!this.state.src.dirty} mode={this.state.src.result}
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

      {
        this.props.placeholder ?
        <AddRemoveIcon className="test-input-addremove" onAdd={()=>{
          this.props.tester.addTestInput(this.state.src.value);

          this.inputElement.focus();
          this.inputElement.select();
        }}/>
        :
        <AddRemoveIcon className="test-input-addremove" onRemove={()=>{
          this.props.tester.removeTestInputByIndex(this.props.index);
        }}/>
      }
    </div>
  }
}

export default TestingInput;
