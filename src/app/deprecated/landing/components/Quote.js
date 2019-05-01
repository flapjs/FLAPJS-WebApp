import React from 'react';
import './Quote.css';

class Quote extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <div className="quote-container">
      <div className="quote">
        {this.props.value}
      </div>
      <div className="subquote">
        {this.props.label}
      </div>
    </div>;
  }
}

export default Quote;
