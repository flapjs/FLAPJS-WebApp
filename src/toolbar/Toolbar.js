import React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component
{
  render()
  {
    const app = this.props.app;
    const drawer = document.getElementsByTagName('Drawer')[0];
    return <div className="toolbar-container">
        <h1>Deterministic Finite Automata</h1>
        <button onClick={app.openDrawer.bind(app)}>OPEN</button>
        <button onClick={app.closeDrawer.bind(app)}>CLOSE</button>
    </div>;
  }
}

export default Toolbar;
