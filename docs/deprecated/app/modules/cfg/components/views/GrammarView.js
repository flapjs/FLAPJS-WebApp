import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';
import {Rule} from 'modules/cfg/machine/CFG.js';
// import GrammarViewStyle from './GrammarView.css';

class GrammarView extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            input_rules: ['']
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    updateRules()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();

        machineController.clear();
        this.state.input_rules.map( (input) =>
        {
            let sides = input.split('->');
            machineController.addMachineRule(new Rule(sides[0], sides[1]));
        });
    }

    onInputChange(index, e)
    {
        const session = this.props.session;
        // const currentModule = session.getCurrentModule();
        // const machineController = currentModule.getMachineController();

        // const value = e.target.value;
        let input_rules = [...this.state.input_rules];
        input_rules[index] = e.target.value;
        this.setState({
            input_rules
        });

        this.updateRules();
        session.getApp().getUndoManager().captureEvent();
    }

    handleDelete(index, e)
    {
        const session = this.props.session;
        // const currentModule = session.getCurrentModule();
        // const machineController = currentModule.getMachineController();

        e.preventDefault();
        let input_rules = [
            ...this.state.input_rules.slice(0, index),
            ...this.state.input_rules.slice(index + 1)
        ];
        this.setState({
            input_rules
        });

        this.updateRules();
        session.getApp().getUndoManager().captureEvent();
    }

    /** @override */
    render()
    {
        /*
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const variables = machineController.getMachineVariables();
        const terminals = machineController.getMachineTerminals();
        const error = !machineController.getMachine().isValid();
        */

        return(
            <div id={this.props.id}
                className={Style.view_pane + ' ' + this.props.className}
                style={this.props.style}>
                HELLO
            </div>
        );
        /*
        return (
            <div id={this.props.id}
                className={Style.view_pane + ' ' + this.props.className}
                style={this.props.style}>
                <div className={Style.view_widget + ' ' + GrammarViewStyle.expression + ' ' + (error ? 'error' : '')}>
                    {this.state.input_rules.map( (rule, index) =>
                    {
                        return (
                            <span key={index}>
                                <input key={index} value={rule} onChange={this.onInputChange(index)}/>
                                <button onClick={this.handleDelete(index)}>X</button>
                            </span>
                        );
                    })}
                </div>
                <div className={Style.view_widget + ' ' + GrammarViewStyle.expression_tray + ' ' + GrammarViewStyle.tray_important}>
                    {variables.map(e =>
                    {
                        return (
                            <button key={e} onClick={() => {this._appendSymbol(machineController, e);}}>{e}</button>
                        );
                    })}
                </div>

                <div className={Style.view_widget + ' ' + GrammarViewStyle.expression_tray + ' ' + GrammarViewStyle.tray_symbol}>
                    {terminals.map(e =>
                    {
                        return (
                            <button key={e} onClick={() => {this._appendSymbol(machineController, e);}}>{e}</button>
                        );
                    })}
                </div>
            </div>
        );
        */

    }
}

export default GrammarView;
