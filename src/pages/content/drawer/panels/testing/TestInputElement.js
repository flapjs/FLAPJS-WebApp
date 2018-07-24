import React from 'react';
import './TestInputElement.css';

import SuccessIcon from './SuccessIcon.js';
import FailureIcon from './FailureIcon.js';
import PendingIcon from './PendingIcon.js';
import RemoveIcon from './RemoveIcon.js';

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

  invalidate()
  {
    this.setState((prev, props) => {
      return {
        dirty: true
      };
    });
  }

  onExecute(e)
  {
    this.test();
  }

  onValueChange(e)
  {
    const value = e.target.value;
    this.setState((prev, props) => {
      return {
        value: value
      };
    });
  }

  render()
  {
    const result = this.state.result;
    let icon = null;
    switch (result)
    {
      case PENDING:
        icon = <PendingIcon active={!this.state.dirty}/>;
        break;
      case SUCCESS:
        icon = <SuccessIcon active={!this.state.dirty} />;
        break;
      case FAILURE:
        icon = <FailureIcon active={!this.state.dirty} />;
        break;
      default:
        throw new Error("Unknown test result: \'" + result + "\'.");
    }
    return <div className="test-input">
      <button className="test-input-result" onClick={this.test.bind(this)}>{icon}</button>
      <input className="test-input-label" contentEditable="true"
        value={this.state.value}
        onChange={e=>{
          this.onValueChange(e);
        }}/>
      <button className="test-input-delete" onClick={this.props.onDelete}>
        <RemoveIcon />
      </button>
    </div>;
  }
}

export default TestInputElement;
