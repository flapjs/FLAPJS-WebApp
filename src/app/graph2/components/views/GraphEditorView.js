import React from 'react';
import PropTypes from 'prop-types';

import ViewportComponent from 'util/input/components/ViewportComponent.js';
import NodeGraphView from './NodeGraphView.js';
import LabelEditorView from './LabelEditorView.js';
import ViewportLayer from '../layers/ViewportLayer.js';
import ViewportNavigationLayer from '../layers/ViewportNavigationLayer.js';

import InputController from 'graph2/controller/InputController.js';
import SelectionBox from 'graph2/controller/SelectionBox.js';

class GraphEditorView extends React.Component
{
    constructor(props)
    {
        super(props);

        this._inputController = new InputController();
        this._selectionBox = new SelectionBox();

        this._viewportComponent = React.createRef();
        this._labelEditorComponent = React.createRef();
        this._graphViewComponent = React.createRef();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        const inputController = this._inputController;
        const selectionBox = this._selectionBox;

        const graphController = this.props.graphController;
        const labelFormatter = graphController.getLabelFormatter();

        const viewport = this.getViewportComponent();
        const inputAdapter = viewport.getInputAdapter();

        graphController.setInputController(inputController);

        inputController.setGraphController(graphController);
        inputController.setSelectionBox(selectionBox);
        inputController.setLabelFormatter(labelFormatter);
        inputAdapter.bindContext(inputController.getInputContext());

        inputController.initialize();
        graphController.initialize();
    }

    /** @override */
    componentDidUpdate()
    {
        this._inputController.update();
        this.props.graphController.update();
    }

    /** @override */
    componentWillUnmount()
    {
        const viewport = this.getViewportComponent();
        const inputAdapter = viewport.getInputAdapter();
        inputAdapter.unbindContext(this._inputController.getInputContext());

        this.props.graphController.destroy();

        this._selectionBox.clearSelection();
        this._inputController.destroy();
    }

    onMouseOver(e) { this._inputController.onMouseOver(e); }
    onMouseOut(e) { this._inputController.onMouseOut(e); }

    getInputController() { return this._inputController; }
    getSelectionBox() { return this._selectionBox; }

    getViewportComponent() { return this._viewportComponent.current; }
    getLabelEditorComponent() { return this._labelEditorComponent.current; }

    /** @override */
    render()
    {
        const viewport = this.getViewportComponent();

        const inputController = this._inputController;
        const selectionBox = this._selectionBox;

        const graphController = this.props.graphController;
        const labelFormatter = graphController.getLabelFormatter();

        const GraphViewComponent = this.props.graphView || NodeGraphView;

        return (
            <React.Fragment>
                <ViewportComponent ref={this._viewportComponent}
                    id={this.props.id}
                    className={this.props.className}
                    style={this.props.style}>
                    {viewport &&
                        <React.Fragment>
                            <GraphViewComponent ref={this._graphViewComponent}
                                graphController={graphController}
                                inputController={inputController}
                                selectionBox={selectionBox}
                                viewport={viewport}
                                onMouseOver={this.onMouseOver}
                                onMouseOut={this.onMouseOut} />
                            {this.props.children}
                        </React.Fragment>}
                </ViewportComponent>
                {viewport &&
                    <React.Fragment>
                        <ViewportLayer
                            graphController={graphController}
                            inputController={inputController}
                            viewport={viewport}>
                            <ViewportNavigationLayer
                                style={{ right: 0 }}
                                viewportAdapter={viewport.getInputAdapter().getViewportAdapter()} />
                            {this.props.overlay}
                        </ViewportLayer>
                        <LabelEditorView ref={ref =>
                        {
                            this._labelEditorComponent.current = ref;
                            graphController.setLabelEditor(ref);
                        }}
                        labelFormatter={labelFormatter}
                        viewport={viewport}
                        saveOnExit={true}>
                            {this.props.labelEditor}
                        </LabelEditorView>
                    </React.Fragment>}
            </React.Fragment>
        );
    }
}

GraphEditorView.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
};

export default GraphEditorView;
