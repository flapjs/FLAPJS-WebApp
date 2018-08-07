import React from 'react';

import './StateTag.css';

class StateTag extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      value: this.props.src.label
    };

    this.onBlur = this.onBlur.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onBlur() {
    const node = this.props.src;
    const onRemove = this.props.onRemove;
    const onRename = this.props.onRename;

    const value = this.state.value;

    if(!value) {
      onRemove(node);
    } else if(value != node.label) {
      onRename(node, value);
    }
  }

  onValueChange(e) {
    const value = e.target.value.trim();
    this.setState({value: value});
  }

  render()
  {
    const node = this.props.src;
    return <div className="statetag-container" draggable="true">
      <input type="text" size="2" className="statetag-input" defaultValue={node.label} spellCheck="false"
      onChange={this.onValueChange} onBlur={this.onBlur}/>
    </div>
  }
}

export default StateTag;
