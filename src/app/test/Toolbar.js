import React from 'react';

class Toolbar extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {};
  }

  //Override
  render()
  {
    //const title = this.props.title;
    //const disabled = this.props.disabled;

    return (
      <div id={this.props.id}
      className={this.props.className}
      style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default Toolbar;
