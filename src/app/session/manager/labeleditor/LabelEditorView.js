import React from 'react';
import Style from './LabelEditorView.css';

import GraphElement from 'graph/GraphElement.js';

import PatternInput from 'deprecated/system/patterninput/PatternInput.js';

class LabelEditorView extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = null;
        this.inputComponent = null;

        this.state = {
            open: false
        };

        this._target = null;
        this._targetCallback = null;

        this.onInputSubmit = this.onInputSubmit.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
    }

    openEditor(graphElement, defaultValue=null, onSubmit=null, onCancel=null)
    {
        if (!(graphElement instanceof GraphElement)) throw new Error("Can only open editor for GraphElements");

        this._target = graphElement;
        this._targetOnSubmit = onSubmit;
        this._targetOnCancel = onCancel;

        const formatter = this.props.labeler.getLabelFormatter(this._target);
        this.inputComponent.setFormatter(formatter);

        this.setState({open: true}, () => {
            if (defaultValue !== null)
            {
                this.inputComponent.resetValue(defaultValue);
            }
            this.inputComponent.focus();
        });
    }

    closeEditor()
    {
        this._target = null;
        this._targetOnSubmit = null;
        this._targetOnCancel = null;

        this.inputComponent.setFormatter(null);

        this.setState({open: false});
    }

    isEditorOpen()
    {
        return this.state.open;
    }

    getTarget()
    {
        return this._target;
    }

    onInputSubmit(value)
    {
        if (this._targetOnSubmit)
        {
            this._targetOnSubmit(this._target, value);
            //Don't handle cancel callbacks...
            this._targetOnCancel = null;
        }
    }

    onInputBlur(e)
    {
        if (this._targetOnCancel)
        {
            this._targetOnCancel(this._target);
            //Don't handle submit callbacks...
            this._targetOnSubmit = null;
        }
        this.closeEditor();
    }

    /** @override */
    render()
    {
        const isEditorOpen = this.state.open;

        const target = this._target;
        const targetStyle = this.props.style || {};
        const viewport = this.props.viewport;
        const labeler = this.props.labeler;

        if (target)
        {
            const center = target.getCenterPoint();
            const element = viewport.getElement();
            const parentClientRect = element.getBoundingClientRect();
            const screenPos = transformViewToScreen(
                element,
                center.x + viewport.getOffsetX(),
                center.y + viewport.getOffsetY()
            );
            const x = screenPos.x;
            const y = screenPos.y;
            const offsetX = -(this.ref.offsetWidth / 2) - parentClientRect.left;
            const offsetY = -(this.ref.offsetHeight / 2) - parentClientRect.top;

            targetStyle['top'] = (y + offsetY) + "px";
            targetStyle['left'] = (x + offsetX) + "px";
        }

        return (
            <div ref={ref=>this.ref=ref}
                id={this.props.id}
                className={Style.editor_container +
          (isEditorOpen ? " open " : "") +
          " " + this.props.className}
                style={targetStyle}>
                <PatternInput ref={ref=>this.inputComponent=ref}
                    submitOnBlur={this.props.saveOnExit}
                    onSubmit={this.onInputSubmit}
                    onBlur={this.onInputBlur}/>
                <div className={Style.tray_container}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

function transformViewToScreen(svg, x, y)
{
    const ctm = svg.getScreenCTM();
    return {
        x: (x * ctm.a) + ctm.e,
        y: (y * ctm.d) + ctm.f
    };
}

export default LabelEditorView;
