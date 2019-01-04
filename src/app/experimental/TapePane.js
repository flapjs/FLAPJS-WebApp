import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';

import TapeWidget from 'experimental/widgets/TapeWidget.js';
import NavbarWidget from 'experimental/widgets/NavbarWidget.js';

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
    const tester = this.props.tester;
    const inputController = module.getInputController();
    const graphController = module.getGraphController();
    const machineController = module.getMachineController();

    return (
      <div id={this.props.id}
        className={Style.view_pane +
          " " + this.props.className}
        style={this.props.style}>
        <NavbarWidget className={Style.view_widget} style={{right: 0}}
          app={app}/>
        <div className={Style.view_widget} style={{bottom: 0}}>
          <TapeWidget value={tester ? tester.getTapeContext() : null}/>
        </div>
      </div>
    );
  }
}

export default TapePane;
