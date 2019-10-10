import React from 'react';
import PropTypes from 'prop-types';
import Style from './ViewportComponent.module.css';

import ViewController from '../../controller/ViewController.js';
import AbstractInputHandler from '../../input/AbstractInputHandler.js';

const DEFAULT_VIEW_SIZE = 300;

class ViewportComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();

        this._viewController = new ViewController();
    }

    addInputHandler(inputHandler)
    {
        if (!(inputHandler instanceof AbstractInputHandler)) throw new Error('input handler must be an instanceof AbstractInputHandler');
        this._viewController.getInputAdapter().addInputHandler(inputHandler);
        return this;
    }

    /** @override */
    componentDidMount()
    {
        this._viewController.getInputAdapter().initialize(this._ref.current);
    }

    /** @override */
    componentWillUnmount()
    {
        this._viewController.getInputAdapter().destroy();
    }

    /** @override */
    componentDidUpdate()
    {
        this._viewController.getInputAdapter().update();
    }

    getSVGTransformString()
    {
        const viewport = this._viewController.getViewportAdapter();
        return 'translate(' + viewport.getOffsetX() + ' ' + viewport.getOffsetY() + ')';
    }

    getSVGViewBoxString(baseViewSize)
    {
        const viewport = this._viewController.getViewportAdapter();
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
        return this._viewController.getInputAdapter();
    }

    getViewportAdapter()
    {
        return this._viewController.getViewportAdapter();
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
ViewportComponent.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    viewSize: PropTypes.number,
};

export default ViewportComponent;
