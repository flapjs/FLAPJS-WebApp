import React from 'react';

class Icon extends React.Component
{
  constructor(props) { super(props); }

  //Override
  render()
  {
    return (
      <svg id={this.props.id} className={this.props.className} style={this.props.style}
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    );
  }
}
export default Icon;
