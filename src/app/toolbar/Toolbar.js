import React from 'react';
import HamburgerIcon from './HamburgerIcon.js';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

import './Toolbar.css';
import SaveIcon from './SaveIcon';
import UndoIcon from './UndoIcon';
import RedoIcon from './RedoIcon';
import NewIcon from './NewIcon';

class Toolbar extends React.Component
{
  constructor(props) {
    super(props);

    this.setType = this.setType.bind(this);
    this.state = {
      isOpen: false,
      type: "DFA"
    };
  }

  setType(curType) {
    this.setState({
      type: curType
    });
  }

  render()
  {
    const app = this.props.app;
    const drawer = document.getElementsByTagName('Drawer')[0];
    return(
        <div
          onClick={app.state.isOpen ?
            app.closeDrawer.bind(app) :
            app.openDrawer.bind(app)}>
          <Navbar className="navBar" dark expand="md">
            <NavbarBrand className="navTitle single-line" href="/" contenteditable="true">Untitled</NavbarBrand>
            <UncontrolledDropdown>
              <DropdownToggle className="navType" nav caret>
                {this.state.type}
              </DropdownToggle>
              <DropdownMenu left>
                <DropdownItem onClick={() => { this.setType("DFA"); }}>
                  DFA
                </DropdownItem>
                <DropdownItem onClick={() => { this.setType("NFA"); }}>
                  NFA
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Nav className="navOption" navbar>
              <NavItem className="navOption">
                <NavLink href="#">
                  <SaveIcon/>
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <NewIcon/>
                </DropdownToggle>
                <DropdownMenu left>
                  <DropdownItem>
                    Unload File
                  </DropdownItem>
                  <DropdownItem>
                    Start From Scratch
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <Nav className="navOption" navbar>
              <NavItem className="navOption">
                <NavLink href="#">
                  <UndoIcon/>
                </NavLink>
              </NavItem>
              <NavItem className="navOption">
                <NavLink href="#">
                  <RedoIcon/>
                </NavLink>
              </NavItem>
            </Nav>
            <HamburgerIcon active={app.state.isOpen}/>
          </Navbar>
        </div>
    );
  }
}

export default Toolbar;
