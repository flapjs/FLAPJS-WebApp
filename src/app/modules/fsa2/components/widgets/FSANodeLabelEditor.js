import React from 'react';
import Style from './FSANodeLabelEditor.css';

import LabelEditor from 'graph2/labeleditor/LabelEditor.js';
import LabelEditorButton from 'grahp2/labeleditor/LabelEditorButton.js';

class FSANodeLabelEditor extends React.Component
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
        const labelEditorComponent = this._ref.current;

        return (
            <LabelEditor
                ref={this._ref}
                id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                viewportAdapter={viewportAdapter}>
                <div className={Style.tray_container}>
                    <LabelEditorButton
                        parent={labelEditorComponent}
                        onClick={e => labelEditorComponent.getTarget().setNodeCustom(!labelEditorComponent.getTarget().getNodeCustom())}>
                        {labelEditorComponent.getTarget().getNodeCustom() ? 'Custom' : 'Auto'}
                    </LabelEditorButton>
                    <LabelEditorButton
                        parent={labelEditorComponent}
                        onClick={e => labelEditorComponent.getTarget().setNodeAccept(!labelEditorComponent.getTarget().getNodeAccept())}>
                        {labelEditorComponent.getTarget().getNodeAccept() ? 'Accept' : 'Reject'}
                    </LabelEditorButton>
                </div>
            </LabelEditor>
        );
    }
}

export default FSANodeLabelEditor;