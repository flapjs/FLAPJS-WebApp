import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';
import ExpressionViewStyle from './ExpressionView.css';

import {EMPTY, UNION, KLEENE, SIGMA, EMPTY_SET, PLUS} from 'modules/re/machine/RE.js';

const UNION_CHAR = "\u222A";

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

    const value = e.target.value;
    const result = value.replace(new RegExp(UNION_CHAR, 'g'), UNION);

    machineController.setMachineExpression(result);
    session.getApp().getUndoManager().captureEvent();
  }

  _appendSymbol(machineController, symbol)
  {
    const session = this.props.session;
    machineController.setMachineExpression(machineController.getMachineExpression() + symbol);
    session.getApp().getUndoManager().captureEvent();
  }

  //Override
  render()
  {
    const session = this.props.session;
    const currentModule = session.getCurrentModule();
    const machineController = currentModule.getMachineController();
    const terminals = machineController.getMachineTerminals();
    const error = !machineController.getMachine().isValid();

    const readableValue = machineController.getMachineExpression().replace(new RegExp(UNION, 'g'), UNION_CHAR);

    return (
      <div id={this.props.id}
        className={Style.view_pane +
          " " + this.props.className}
        style={this.props.style}>
        <div className={Style.view_widget + " " +
          ExpressionViewStyle.expression + " " +
          (error ? "error" : "")}>
          <input ref={ref=>this._inputElement=ref} value={readableValue} onChange={this.onInputChange}/>
        </div>
        <div className={Style.view_widget + " " + ExpressionViewStyle.expression_tray + " " + ExpressionViewStyle.tray_important}>
          <button onClick={() => {this._appendSymbol(machineController, EMPTY)}}>{EMPTY}</button>
          <button onClick={() => {this._appendSymbol(machineController, UNION)}}>{UNION_CHAR}</button>
          <button onClick={() => {this._appendSymbol(machineController, KLEENE)}}>{KLEENE}</button>
          <button onClick={() => {this._appendSymbol(machineController, PLUS)}}>{PLUS}</button>
          <button onClick={() => {this._appendSymbol(machineController, SIGMA)}}>{SIGMA}</button>
          <button onClick={() => {this._appendSymbol(machineController, EMPTY_SET)}}>{EMPTY_SET}</button>
        </div>

        <div className={Style.view_widget + " " + ExpressionViewStyle.expression_tray + " " + ExpressionViewStyle.tray_symbol}>
          {terminals.map(e => {
            return (
              <button key={e} onClick={() => {this._appendSymbol(machineController, e)}}>{e}</button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ExpressionView;