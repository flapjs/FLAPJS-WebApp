import React from 'react';
import Style from './viewport/ViewportView.css';

import TapeWidget from './widgets/TapeWidget.js';
import NavbarWidget from './widgets/NavbarWidget.js';

class TapePane extends React.Component
{
  constructor(props)
  {
    super(props);
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

    return (
      <div id={this.props.id}
        className={this.props.className}
        style={this.props.style}>
        <NavbarWidget className={Style.view_widget} style={{right: 0}}
          app={app}/>
        <div className={Style.view_widget} style={{bottom: 0}}>
          <TapeWidget/>
        </div>
      </div>
    );
  }
}

export default TapePane;
