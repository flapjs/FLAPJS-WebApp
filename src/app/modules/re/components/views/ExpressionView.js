import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';
import ExpressionViewStyle from './ExpressionView.css';

import {EMPTY, UNION, KLEENE} from 'modules/re/machine/RE.js';

class ExpressionView extends React.Component
{
  constructor(props)
  {
    super(props);

    this._inputElement = null;

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

  _appendSymbol(machineController, symbol)
  {
    machineController.setMachineExpression(machineController.getMachineExpression() + symbol);
  }

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();

    const error = !machineController.getMachine().isValid();

    return (
      <div id={this.props.id}
        className={Style.view_pane +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.view_widget + " " +
          ExpressionViewStyle.expression + " " +
          (error ? "error" : "")}>
          <input ref={ref=>this._inputElement=ref}value={machineController.getMachineExpression()} onChange={this.onInputChange}/>
        </div>
        <div className={Style.view_widget + " " + ExpressionViewStyle.expression_tray + " " + ExpressionViewStyle.tray_important}>
          <button onClick={() => {this._appendSymbol(machineController, EMPTY)}}>{EMPTY}</button>
          <button onClick={() => {this._appendSymbol(machineController, UNION)}}>{UNION}</button>
          <button onClick={() => {this._appendSymbol(machineController, KLEENE)}}>{KLEENE}</button>
        </div>

        <div className={Style.view_widget + " " + ExpressionViewStyle.expression_tray + " " + ExpressionViewStyle.tray_symbol}>
          <button onClick={() => {this._appendSymbol(machineController, "a")}}>{"a"}</button>
          <button onClick={() => {this._appendSymbol(machineController, "b")}}>{"b"}</button>
        </div>
      </div>
    );
  }
}

export default ExpressionView;
