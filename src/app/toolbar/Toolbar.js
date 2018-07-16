import React from 'react';
import HamburgerIcon from './HamburgerIcon.js';

import './Toolbar.css';

class Toolbar extends React.Component
{
  render()
  {
    const app = this.props.app;
    const drawer = document.getElementsByTagName('Drawer')[0];
    return <div className="toolbar-container">
        <h1>Deterministic Finite Automata</h1>
    </div>;
  }
}

export default Toolbar;
