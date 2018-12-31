import React from 'react';
import Style from './pane/PaneView.css';

import TapeWidget from './widgets/TapeWidget.js';
import NavbarWidget from './widgets/NavbarWidget.js';

class TapePane extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      active: false
    };
  }

  //Override
  render()
  {
    const app = this.props.app;
    const module = this.props.module;
    const viewport = this.props.viewport;
    const inputController = module.getInputController();
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();

    const isActive = this.props.active;

    return (
      <div id={this.props.id}
        className={Style.pane_container +
          (isActive ? " active " : "") +
          " " + this.props.className}
        style={this.props.style}>
        <NavbarWidget className={Style.pane_widget} style={{right: 0}}
          app={app}/>
        <div className={Style.pane_widget} style={{bottom: 0}}>
          <TapeWidget/>
        </div>
      </div>
    );
  }
}

export default TapePane;
