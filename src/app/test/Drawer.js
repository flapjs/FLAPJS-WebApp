import React from 'react';

class Drawer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {};
  }

  //Override
  render()
  {
    return (
      <div className="">
      {this.props.children}
      </div>
    );
  }
}

export default Drawer;
