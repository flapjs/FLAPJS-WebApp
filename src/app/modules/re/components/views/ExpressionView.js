import React from 'react';
import Style from './ViewportView.css';
import ExpressionViewStyle from './ExpressionView.css';

import {EMPTY, CONCAT, UNION, KLEENE, SIGMA, EMPTY_SET, PLUS} from 'modules/re/machine/RE.js';

const UNION_CHAR = '\u222A';

class ExpressionView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputElement = null;

        this.onInputChange = this.onInputChange.bind(this);
        this.onClick = this.onClick.bind(this);
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

    onClick(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const cursorPos = this._inputElement.selectionStart;

        const scope = machineController._parser.scopeFromSpaceIndexing(machineController.getMachine(), cursorPos);
        this._inputElement.setSelectionRange(scope[0][0], scope[1][1]);
    }

    _appendSymbol(machineController, symbol)
    {
        const session = this.props.session;
        const currentExpression = machineController.getMachineExpression();
        const cursorPos = this._inputElement.selectionStart;
        const newExpression = currentExpression.slice(0, cursorPos) + symbol + currentExpression.slice(cursorPos);
        machineController.setMachineExpression(newExpression);
        session.getApp().getUndoManager().captureEvent();
        this._inputElement.focus();
    }

    /** @override */
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
          ' ' + this.props.className}
                style={this.props.style}>
                <div className={Style.view_widget + ' ' +
          ExpressionViewStyle.expression + ' ' +
          (error ? 'error' : '')}>
                    <input ref={ref=>this._inputElement=ref} value={readableValue} onChange={this.onInputChange} onClick={this.onClick}/>
                </div>
                <div className={Style.view_widget + ' ' + ExpressionViewStyle.expression_tray + ' ' + ExpressionViewStyle.tray_important}>
                    <button title="Epsilon"       onClick={() => {this._appendSymbol(machineController, EMPTY);}}>{EMPTY}</button>
                    <button title="Union"         onClick={() => {this._appendSymbol(machineController, UNION);}}>{UNION_CHAR}</button>
                    <button title="Concat"        onClick={() => {this._appendSymbol(machineController, CONCAT);}}>{CONCAT}</button>
                    <button title="Kleene Star"   onClick={() => {this._appendSymbol(machineController, KLEENE);}}>{KLEENE}</button>
                    <button title="Kleene Plus"   onClick={() => {this._appendSymbol(machineController, PLUS);}}>{PLUS}</button>
                    <button title="Sigma"         onClick={() => {this._appendSymbol(machineController, SIGMA);}}>{SIGMA}</button>
                    <button title="Empty Set"     onClick={() => {this._appendSymbol(machineController, EMPTY_SET);}}>{EMPTY_SET}</button>
                </div>

                <div className={Style.view_widget + ' ' + ExpressionViewStyle.expression_tray + ' ' + ExpressionViewStyle.tray_symbol}>
                    {terminals.map(e => 
                    {
                        return (
                            <button key={e} onClick={() => {this._appendSymbol(machineController, e);}}>{e}</button>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ExpressionView;
