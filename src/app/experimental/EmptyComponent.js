import React from 'react';

class EmptyComponent extends React.Component
{
  constructor(props) { super(props); }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
        className={this.props.className}
        style={this.props.style}>
      </div>
    );
  }
}

export default EmptyComponent;
