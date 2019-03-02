import React from 'react';
import Style from './viewport/ViewportView.css';

import ModeSelectTray from './widgets/ModeSelectTray.js';
import TrashCanWidget from './widgets/TrashCanWidget.js';
import NavbarWidget from './widgets/NavbarWidget.js';

class EditPane extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const app = session.getApp();
    
    const viewport = this.props.viewport;
    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const inputActionMode = inputController.isActionMode();

    return (
      <div id={this.props.id}
        className={Style.view_pane +
          " " + this.props.className}
        style={this.props.style}>
        <NavbarWidget className={Style.view_widget} style={{right: 0}}
          app={app}/>
        <div className={Style.view_widget} style={{bottom: 0, left: 0}}>
          <ModeSelectTray mode={inputActionMode ? 0 : 1} onChange={modeIndex => inputController.setInputScheme(modeIndex === 0)}/>
        </div>
        <div className={Style.view_widget} style={{bottom: 0, right: 0}}>
          <TrashCanWidget app={app} inputController={inputController} graphController={graphController}/>
        </div>
      </div>
    );
  }
}

export default EditPane;
