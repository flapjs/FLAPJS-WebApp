import React from 'react';

import './StateTag.css';

class StateTag extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {

    };
  }

  render()
  {
    const node = this.props.src;
    return <div className="statetag-container">
      <label>{node.label}</label>
    </div>
  }
}

export default StateTag;
