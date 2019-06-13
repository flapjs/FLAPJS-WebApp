import React from 'react';
import Style from './REGrammarView.css';

import FormattedInput from 'graph2/components/widgets/formatter/FormattedInput.js';
import DebounceButton from 'graph2/components/widgets/formatter/DebounceButton.js';

import { UNION } from 'modules/re/machine/RE.js';

export const UNION_CHAR = 'U';

class REGrammarView extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this._inputComponent = React.createRef();

        this._zoomFactor = 1;

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onWheel = this.onWheel.bind(this);
    }

    onChange(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const component = this._inputComponent.current;
        component.getDebounceComponent().updateCaretPosition();

        // Replace all unions chars with union symbols...
        let result = e.value;
        result = result.replace(new RegExp(UNION_CHAR, 'g'), UNION);

        machineController.setMachineExpression(result);
        session.getApp().getUndoManager().captureEvent();
    }

    onClick(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const cursorPosition = e.target.selectionStart;
        const scope = machineController._parser.scopeFromSpaceIndexing(machineController.getMachine(), cursorPosition);
        e.target.setSelectionRange(scope[0][0], scope[1][1]);
    }

    onWheel(e)
    {
        this._zoomFactor += e.deltaY * 0.001;
    }

    appendRESymbol(symbol)
    {
        this._inputComponent.current.appendValue(symbol, true);
    }

    /** @override */
    componentDidUpdate()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const machineExpression = machineController.getMachineExpression();
        const component = this._inputComponent.current;
        if (machineExpression !== component.getValue())
        {
            component.getDebounceComponent().updateCaretPosition();
            const caret = component.getDebounceComponent().getCaretPosition();
            component.setValue(machineExpression, true);
            component.getDebounceComponent().setCaretPosition(caret.start, caret.end, true);
        }
    }

    /** @override */
    render()
    {
        const inputComponent = this._inputComponent.current;
        const multiline = this.props.multiline;

        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const terminals = machineController.getMachineTerminals();
        const error = !machineController.getMachine().isValid();

        //TODO: Undo/Redo doesn't work.

        return (
            <div className={Style.grammar_container}>
                <div className={Style.grammar_space}></div>
                <FormattedInput
                    ref={this._inputComponent}
                    className={Style.grammar_input +
                        (multiline ? ' multiline ' : '') +
                        (error ? ' error ' : '')}
                    multiline={multiline}
                    onChange={this.onChange}

                    onClick={this.onClick}
                    onWheel={this.onWheel}>
                </FormattedInput>
                <div className={Style.grammar_space}></div>
                <div className={Style.grammar_tray}>
                    {
                        inputComponent && terminals.map(e =>
                            <DebounceButton key={e}
                                parent={inputComponent.getDebounceComponent()}
                                onClick={() => this.appendRESymbol(e)}>
                                {e}
                            </DebounceButton>)
                    }
                </div>
            </div>
        );
    }
}

export default REGrammarView;