import React from 'react';

import BoxRenderer from 'graph2/renderer/BoxRenderer.js';
import GraphHighlightLayer from './GraphHighlightLayer.js';

import SelectionBoxInputHandler from 'graph2/inputs/SelectionBoxInputHandler.js';

class SelectionBoxLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;
        const selectionBox = props.selectionBox;

        //this._selectionBox = new SelectionBox();
        this._selectionBoxInputHandler = new SelectionBoxInputHandler(inputController, graphController, selectionBox);
    }

    /** @override */
    componentDidMount()
    {
        const inputContext = this.props.inputContext;

        if (inputContext)
        {
            const inputPriority = this.props.inputPriority || -1;
            inputContext.addInputHandler(this._selectionBoxInputHandler, inputPriority);
        }
    }

    /** @override */
    componentWillUnmount()
    {
        this.props.selectionBox.clearSelection();
        // this._selectionBox.clearSelection();

        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._selectionBoxInputHandler);
        }
    }

    getSelectionBox() { return this._selectionBox; }

    /** @override */
    render()
    {
        // const selectionBox = this._selectionBox;
        const selectionBox = this.props.selectionBox;
        const selectionBoundingBox = selectionBox.getBoundingBox();

        return (
            <React.Fragment>
                <GraphHighlightLayer
                    nodes={selectionBox.getSelection()} />
                <BoxRenderer visible={selectionBox.isVisible()}
                    fromX={selectionBoundingBox.fromX}
                    fromY={selectionBoundingBox.fromY}
                    toX={selectionBoundingBox.toX}
                    toY={selectionBoundingBox.toY} />
            </React.Fragment>
        );
    }
}

export default SelectionBoxLayer;