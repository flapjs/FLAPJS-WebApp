import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';

import ExpressionViewStyle from './ExpressionView.css';

class ExpressionView extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e)
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    machineController.setMachineExpression(e.target.value);
    session.getApp().getUndoManager().captureEvent();
  }

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    return (
      <div id={this.props.id}
        className={Style.view_pane +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.view_widget + " " + ExpressionViewStyle.expression}>
          <input value={machineController.getMachineExpression()} onChange={this.onInputChange}/>
        </div>
      </div>
    );
  }
}

export default ExpressionView;
