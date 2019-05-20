import React from 'react';
import Style from './ViewportComponent.css';

import ViewportAdapter from '../ViewportAdapter.js';
import InputAdapter from '../InputAdapter.js';
import AbstractInputHandler from '../AbstractInputHandler.js';

const DEFAULT_VIEW_SIZE = 300;
const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

class ViewportComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();

        this._viewportAdapter = new ViewportAdapter()
            .setMinScale(MIN_SCALE)
            .setMaxScale(MAX_SCALE)
            .setOffsetDamping(SMOOTH_OFFSET_DAMPING);
        this._inputAdapter = new InputAdapter(this._viewportAdapter);
    }

    addInputHandler(inputHandler)
    {
        if (!(inputHandler instanceof AbstractInputHandler)) throw new Error('input handler must be an instanceof AbstractInputHandler');
        this._inputAdapter.addInputHandler(inputHandler);
        return this;
    }

    /** @override */
    componentDidMount()
    {
        this._inputAdapter.initialize(this._ref.current);
    }

    /** @override */
    componentWillUnmount()
    {
        this._inputAdapter.destroy();
    }

    /** @override */
    componentDidUpdate()
    {
        this._inputAdapter.update();
    }

    getSVGTransformString()
    {
        const viewport = this._viewportAdapter;
        return 'translate(' + viewport.getOffsetX() + ' ' + viewport.getOffsetY() + ')';
    }

    getSVGViewBoxString(baseViewSize)
    {
        const viewport = this._viewportAdapter;
        const viewSize = baseViewSize * Math.max(Number.MIN_VALUE, viewport.getScale());
        const halfViewSize = viewSize / 2;
        return (-halfViewSize) + ' ' + (-halfViewSize) + ' ' + viewSize + ' ' + viewSize;
    }

    getSVGElement()
    {
        return this._ref.current;
    }

    getInputAdapter()
    {
        return this._inputAdapter;
    }

    getViewportAdapter()
    {
        return this._inputAdapter.getViewportAdapter();
    }

    /** @override */
    render()
    {
        const viewBox = this.getSVGViewBoxString(this.props.viewSize || DEFAULT_VIEW_SIZE);
        const transform = this.getSVGTransformString();

        return (
            <svg ref={this._ref}
                id={this.props.id}
                className={Style.viewport_component + ' ' + this.props.className}
                style={this.props.style}
                viewBox={viewBox}>
                <g transform={transform}>
                    {this.props.children}
                </g>
            </svg>
        );
    }
}

export default ViewportComponent;