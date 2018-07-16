import React from 'react';
import './NaviBar.css';


export default class NaviBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <nav className="navBar">
          <a href="#" className="navTitle">Untitled</a>
          <a href="#" className="navOption">Save</a>
          <a href="#" className="navOption">New</a>
          <a href="#" className="navOption">Undo</a>
          <a href="#" className="navOption">Redo</a>
        </nav>
    );
  }
}