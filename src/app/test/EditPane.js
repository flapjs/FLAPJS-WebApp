import React from 'react';
import Style from './pane/PaneView.css';

import ModeSelectTray from './widgets/ModeSelectTray.js';
import TrashCanWidget from './widgets/TrashCanWidget.js';
import NavbarWidget from './widgets/NavbarWidget.js';

class EditPane extends React.Component
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
    const inputActionMode = inputController.isActionMode(graphController);
    const LabelEditor = module.getLabelEditor();

    const isActive = this.props.active;

    return (
      <div id={this.props.id}
        className={Style.pane_container +
          (isActive ? " active " : "") +
          " " + this.props.className}
        style={this.props.style}>
        { LabelEditor &&
          <LabelEditor ref={ref=>graphController.labelEditorElement=ref}
          inputController={inputController}
          graphController={graphController}
          machineController={machineController}
          screen={app._workspace ? app._workspace.ref : null}/> }
        <NavbarWidget className={Style.pane_widget} style={{right: 0}}
          app={app}/>
        <div className={Style.pane_widget} style={{bottom: 0, left: 0}}>
          <ModeSelectTray mode={inputActionMode ? 0 : 1} onChange={modeIndex => inputController.setInputScheme(modeIndex === 0)}/>
        </div>
        <div className={Style.pane_widget} style={{bottom: 0, right: 0}}>
          <TrashCanWidget inputController={inputController}/>
        </div>
      </div>
    );
  }
}

export default EditPane;
