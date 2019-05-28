import React from 'react';
import Style from './LabelEditor.css';

import GraphElement from 'graph2/element/GraphElement.js';

import FormattedInput from '../components/widgets/formatter/FormattedInput.js';

class LabelEditor extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();
        this._inputComponent = React.createRef();

        this.state = {
            open: false
        };

        this._target = null;
        this._targetOnSubmit = null;
        this._targetOnCancel = null;

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    openEditor(targetGraphElement, defaultValue = null, onSubmit = null, onCancel = null)
    {
        if (!(targetGraphElement instanceof GraphElement))
            throw new Error('Can only open editor for instances of GraphElement');

        const inputComponent = this._inputComponent.current;

        if (this._target)
        {
            inputComponent.blur();
        }

        this._target = targetGraphElement;
        this._targetOnSubmit = onSubmit;
        this._targetOnCancel = onCancel;

        inputComponent.setValue(defaultValue || '', true);
        this.setState({ open: true }, () => inputComponent.focus());
    }

    closeEditor() { this._inputComponent.current.blur(); }
    isEditorOpen() { return this.state.open; }

    onSubmit(e)
    {
        if (this._targetOnSubmit)
        {
            this._targetOnSubmit(e);
        }
    }

    onCancel(e)
    {
        if (this._targetOnCancel)
        {
            this._targetOnCancel(e);
        }
    }

    onChange(e)
    {
        if (this.props.onChange) this.props.onChange(e);
    }

    onBlur(e)
    {
        this._target = null;
        this.setState({ open: false });
    }

    getTarget() { return this._target; }
    getInputComponent() { return this._inputComponent.current; }

    /** @override */
    render()
    {
        const viewportAdapter = this.props.viewportAdapter;
        const editorOpen = this.state.open;
        const target = this._target;

        const style = this.props.style || {};

        if (viewportAdapter && target && editorOpen)
        {
            const centerPoint = target.getCenterPoint();
            const viewportElement = viewportAdapter.getElement();
            const viewportElementBoundingRect = viewportElement.getBoundingClientRect();
            const screenPosition = transformViewToScreenPosition(
                viewportElement,
                centerPoint.x + viewportAdapter.getOffsetX(),
                centerPoint.y + viewportAdapter.getOffsetY()
            );
            const offsetX = -(this._ref.current.offsetWidth / 2) - viewportElementBoundingRect.left;
            const offsetY = -(this._ref.current.offsetHeight / 2) - viewportElementBoundingRect.top;
            style['top'] = (screenPosition.y + offsetY) + 'px';
            style['left'] = (screenPosition.x + offsetX) + 'px';
        }

        return (
            <div ref={this._ref}
                id={this.props.id}
                className={Style.editor_container +
                    (editorOpen ? ' open ' : '') +
                    ' ' + this.props.className}
                style={style}>
                <FormattedInput ref={this._inputComponent}
                    onSubmit={this.onSubmit}
                    onCancel={this.onCancel}
                    onChange={this.onChange}
                    onBlur={this.onBlur} />
                {this.props.children}
            </div>
        );
    }
}

/**
 * Transform the position from viewport coordinate space to screen space.
 * @param {SVGElement} svg the svg viewport element
 * @param {Number} x the x position in viewport space
 * @param {Number} y the y position in viewport space
 * @returns {Object} the transformed position {x, y}.
 */
function transformViewToScreenPosition(svg, x, y)
{
    const ctm = svg.getScreenCTM();
    return {
        x: (x * ctm.a) + ctm.e,
        y: (y * ctm.d) + ctm.f
    };
}

export default LabelEditor;
