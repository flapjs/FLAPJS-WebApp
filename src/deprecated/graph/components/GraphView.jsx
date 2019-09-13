import React from 'react';
import PropTypes from 'prop-types';

import ViewportComponent from '../../input/components/ViewportComponent.jsx';

import InputController from '../controller/InputController.js';
import InputContext from '../../input/InputContext.js';

import ViewportInputHandler from '../inputhandler/ViewportInputHandler.js';

class GraphView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputController = new InputController();
        this._inputContext = new InputContext();

        this._viewportComponent = React.createRef();

        this._viewportInputHandler = new ViewportInputHandler(this._inputController);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this._inputContext;
        const viewport = this._viewportComponent.current;
        const inputAdapter = viewport.getInputAdapter();
        inputContext
            .addInputHandler(this._inputController)
            .addInputHandler(this._viewportInputHandler, 10);
        inputAdapter.bindContext(inputContext);
    }

    /** @override */
    componentWillUnmount()
    {
        const inputContext = this._inputContext;
        const viewport = this._viewportComponent.current;
        const inputAdapter = viewport.getInputAdapter();
        inputContext.clearInputHandlers();
        inputAdapter.unbindContext(inputContext);
    }

    moveViewToPosition(x, y)
    {
        // Center view at position; inverted due to graph-to-screen space
        this.getViewportAdapter().setOffset(-x, -y);
    }

    getInputController() { return this._inputController; }
    getInputContext() { return this._inputContext; }

    getViewportComponent() { return this._viewportComponent.current; }
    getInputAdapter() { return this._viewportComponent.current.getInputAdapter(); }
    getViewportAdapter() { return this._viewportComponent.current.getViewportAdapter(); }

    /** @override */
    render()
    {
        const inputController = this._inputController;
        const viewport = this._viewportComponent.current;
        const renderGraph = this.props.renderGraph;
        const renderOverlay = this.props.renderOverlay;

        return (
            <div id={this.props.id}
                className={this.props.className}
                style={this.props.style}>
                <ViewportComponent ref={this._viewportComponent}>
                    {renderGraph && viewport && renderGraph(this, viewport, inputController)}
                </ViewportComponent>
                {renderOverlay && viewport && renderOverlay(this, viewport, inputController)}
            </div>
        );
    }
}
GraphView.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    renderGraph: PropTypes.func,
    renderOverlay: PropTypes.func,
};

export default GraphView;
