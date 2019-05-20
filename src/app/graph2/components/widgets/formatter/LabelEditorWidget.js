import React from 'react';
import Style from './LabelEditorWidget.css';

import GraphNode from 'graph2/element/GraphNode.js';
import GraphEdge from 'graph2/element/GraphEdge.js';

import FormattedInput from './FormattedInput.js';

class LabelEditorWidget extends React.Component
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
        this._submitCallback = null;
        this._cancelCallback = null;

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    openEditor(graphElement, defaultValue = null, onSubmit = null, onCancel = null)
    {
        if (defaultValue)
        {
            this._inputComponent.current.setValue(defaultValue, true);
        }
        else
        {
            if (graphElement instanceof GraphNode)
            {
                this._inputComponent.current.setValue(graphElement.getNodeLabel(), true);
            }
            else if (graphElement instanceof GraphEdge)
            {
                this._inputComponent.current.setValue(graphElement.getEdgeLabel(), true);
            }
            else
            {
                throw new Error('Found unsupported target for label editor');
            }
        }

        this._target = graphElement;
        this._submitCallback = onSubmit;
        this._cancelCallback = onCancel;

        this.setState({ open: true }, () =>
        {
            this._inputComponent.current.focus();
        });
    }

    closeEditor()
    {
        if (this._inputComponent.current.hasFocus())
        {
            this._inputComponent.current.blur();
        }

        this.setState({ open: false });
    }

    onChange(e)
    {
        // TODO: Apply formatting here.
    }

    onSubmit(e)
    {
        if (this._submitCallback)
        {
            this._submitCallback(this._target, e.value);
        }

        this._submitCallback = null;
        this._cancelCallback = null;
    }

    onCancel(e)
    {
        if (this._cancelCallback)
        {
            this._cancelCallback(this._target, e.value);
        }

        this._submitCallback = null;
        this._cancelCallback = null;
    }

    onBlur(e)
    {
        this.closeEditor();
    }

    isEditorOpen() { return this.state.open; }
    getInputComponent() { return this._inputComponent; }
    getTarget() { return this._target; }

    /** @override */
    render()
    {
        const isEditorOpen = this.state.open;

        const target = this._target;
        const targetStyle = this.props.style || {};
        const viewport = this.props.viewport;

        if (viewport)
        {
            const viewportAdapter = this.props.viewport.getViewportAdapter();

            if (target)
            {
                const center = target.getCenterPoint();
                const element = viewportAdapter.getElement();
                const parentClientRect = element.getBoundingClientRect();
                const screenPos = transformViewToScreen(
                    element,
                    center.x + viewportAdapter.getOffsetX(),
                    center.y + viewportAdapter.getOffsetY()
                );
                const x = screenPos.x;
                const y = screenPos.y;
                const offsetX = -(this._ref.current.offsetWidth / 2) - parentClientRect.left;
                const offsetY = -(this._ref.current.offsetHeight / 2) - parentClientRect.top;

                targetStyle['top'] = (y + offsetY) + 'px';
                targetStyle['left'] = (x + offsetX) + 'px';
            }
        }

        return (
            <div ref={this._ref}
                id={this.props.id}
                className={Style.editor_container +
                    (isEditorOpen ? ' open ' : '') +
                    ' ' + this.props.className}
                style={targetStyle}>
                <FormattedInput
                    ref={this._inputComponent}
                    onSubmit={this.onSubmit}
                    onCancel={this.onCancel}
                    onBlur={this.onBlur}
                    onChange={this.onChange} />
                {this.props.renderTray && this.props.renderTray(this)}
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

export default LabelEditorWidget;
