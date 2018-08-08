import React from 'react';

import './AlphabetTag.css';

class AlphabetTag extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {

    };
  }

  render()
  {
    const symbol = this.props.src;
    return <div className="alphatag-container">
      <label>{symbol}</label>
    </div>
  }
}

export default AlphabetTag;
