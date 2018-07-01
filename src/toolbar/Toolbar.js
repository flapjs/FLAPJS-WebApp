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
        <div
          onClick={app.state.isOpen ?
            app.closeDrawer.bind(app) :
            app.openDrawer.bind(app)}>
          <HamburgerIcon active={app.state.isOpen}/>
        </div>
    </div>;
  }
}

export default Toolbar;
