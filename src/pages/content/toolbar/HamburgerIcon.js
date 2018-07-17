import React from 'react';

import './HamburgerIcon.css';

class HamburgerIcon extends React.Component
{
  render()
  {
    const active = this.props.active;
    return <div className="hamburger-container">
      <div className={"hambar1" + (active ? " open" : "")}></div>
      <div className={"hambar2" + (active ? " open" : "")}></div>
      <div className={"hambar3" + (active ? " open" : "")}></div>
    </div>
  }
}

export default HamburgerIcon;
