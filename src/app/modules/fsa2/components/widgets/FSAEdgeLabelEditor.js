import React from 'react';
import Style from './FSAEdgeLabelEditor.css';

import LabelEditor from 'graph2/labeleditor/LabelEditor.js';
import LabelEditorButton from 'grahp2/labeleditor/LabelEditorButton.js';

import {EMPTY_CHAR} from 'modules/fsa2/graph/element/FSAEdge.js';

const RECOMMENDED_SYMBOLS = ['0', '1'];
const DEFAULT_SYMBOLS = [EMPTY_CHAR];

class FSAEdgeLabelEditor extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();
    }

    renderSymbolButton(symbol)
    {
        const labelEditorComponent = this._ref.current;
        return (
            <LabelEditorButton key={symbol}
                parent={labelEditorComponent}
                title={symbol}
                onClick={e => labelEditorComponent.getInputComponent().appendValue(symbol)}>
                {symbol}
            </LabelEditorButton>
        );
    }

    /** @override */
    render()
    {
        const viewportAdapter = this.props.viewportAdapter;
        const machineController = this.props.machineController;
        const machineAlphabet = machineController.getAlphabet();

        const showDefault = true;
        const showRecommended = !machineAlphabet || machineAlphabet.length <= 1;

        return (
            <LabelEditor
                ref={this._ref}
                id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                viewportAdapter={viewportAdapter}>
                <div className={Style.tray_container}>
                    <span>
                        <span className={Style.tray_used}>
                            {machineAlphabet.map(e => this.renderSymbolButton(e))}
                        </span>
                        <span className={Style.tray_default}>
                            {showRecommended &&
                                RECOMMENDED_SYMBOLS.map(e => this.renderSymbolButton(e))}
                            {showDefault &&
                                DEFAULT_SYMBOLS.map(e => this.renderSymbolButton(e))}
                        </span>
                    </span>
                </div>
            </LabelEditor>
        );
    }
}

export default FSAEdgeLabelEditor;