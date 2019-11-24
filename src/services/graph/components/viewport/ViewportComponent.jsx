import React from 'react';
import PropTypes from 'prop-types';
import Style from './ViewportComponent.module.css';

const DEFAULT_VIEW_SIZE = 300;

class ViewportComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        this._ref = React.createRef();
    }

    /** @override */
    componentDidMount()
    {
        this.props.inputAdapter.initialize(this._ref.current);
    }

    /** @override */
    componentWillUnmount()
    {
        this.props.inputAdapter.destroy();
    }

    /** @override */
    componentDidUpdate()
    {
        this.props.inputAdapter.update();
    }

    getSVGTransformString()
    {
        const viewport = this.props.inputAdapter.getViewportAdapter();
        return 'translate(' + viewport.getOffsetX() + ' ' + viewport.getOffsetY() + ')';
    }

    getSVGViewBoxString(baseViewSize)
    {
        const viewport = this.props.inputAdapter.getViewportAdapter();
        const viewSize = baseViewSize * Math.max(Number.MIN_VALUE, viewport.getScale());
        const halfViewSize = viewSize / 2;
        return (-halfViewSize) + ' ' + (-halfViewSize) + ' ' + viewSize + ' ' + viewSize;
    }

    getSVGElement()
    {
        return this._ref.current;
    }

    /** @override */
    render()
    {
        const viewBox = this.getSVGViewBoxString(this.props.viewSize);
        const transform = this.getSVGTransformString();

        return (
            <svg ref={this._ref}
                id={this.props.id}
                className={Style.viewport_component + ' ' + this.props.className}
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
    className: PropTypes.string,
    children: PropTypes.node,
    viewSize: PropTypes.number,
    inputAdapter: PropTypes.object.isRequired,
};
ViewportComponent.defaultProps = {
    viewSize: DEFAULT_VIEW_SIZE,
};

export default ViewportComponent;
