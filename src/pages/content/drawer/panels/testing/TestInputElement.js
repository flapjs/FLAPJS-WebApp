import React from 'react';
import * as Config from 'config.js';
import './TestInputElement.css';

import AddRemoveIcon from './AddRemoveIcon.js';
import StatusIcon from './StatusIcon.js';

import { solveNFA } from 'machine/util/solveNFA.js';

const PENDING = 0;
const SUCCESS = 1;
const FAILURE = -1;

class TestInputElement extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      value: this.props.value,
      result: 0,
      dirty: true
    };

    this.inputElement = React.createRef();

    this.onValueChange = this.onValueChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  test()
  {
    let result = 0;

    const graph = this.props.graph;
    const nfa = graph.toNFA();
    result = solveNFA(nfa, this.state.value) ? 1 : -1;

    this.setState((prev, props) => {
      return {
        result: result,
        dirty: false
      };
    });
  }

  clear()
  {
    this.setState({
      value: "",
      result: 0,
      dirty: true
    });
  }

  invalidate()
  {
    this.setState((prev, props) => {
      return {
        dirty: true
      };
    });
  }

  getValue()
  {
    return this.state.value;
  }

  onValueChange(e)
  {
    this.setState({
      value: e.target.value,
      dirty: true
    });
  }

  onKeyUp(e)
  {
    if (e.keyCode === Config.SUBMIT_KEY)
    {
      this.test();
    }
  }

  render()
  {
    const result = this.state.result;
    const placeholder = this.props.placeholder;

    return <div className="test-input">
      <button className="test-input-result" onClick={this.test.bind(this)}>
        <StatusIcon active={!this.state.dirty} mode={this.state.result}/>
      </button>
      <input type="text" className="test-input-label" ref={ref=>this.inputElement=ref}
        value={this.state.value}
        onChange={this.onValueChange}
        onKeyUp={this.onKeyUp}/>
      <button className="test-input-delete"
        onClick={(e) => {
          if (this.props.placeholder)
          {
            this.props.onAdd(this);
          }
          else
          {
            this.props.onDelete(this);
          }
        }}>
        <AddRemoveIcon add={placeholder}/>
      </button>
    </div>;
  }
}

export default TestInputElement;
