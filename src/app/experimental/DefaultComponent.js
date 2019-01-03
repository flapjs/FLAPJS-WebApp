import React from 'react';
import Style from './DefaultComponent.css';

class DefaultComponent extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    return (
      <div id={this.props.id}
        className={Style.defaultcomponent_container +
          " " + this.props.className}
        style={this.props.style}>
      </div>
    );
  }
}

export default DefaultComponent;
