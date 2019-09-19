/* eslint-disable jsx-a11y/mouse-events-have-key-events */
// FIXME: This has gotta be fixed.

import React from 'react';
import PropTypes from 'prop-types';

import BoxRenderer from '../renderer/BoxRenderer.jsx';
import GraphHighlightLayer from './GraphHighlightLayer.jsx';

import SelectionBox from '../../controller/SelectionBox.js';
import SelectionBoxInputHandler from '../../controller/inputhandler/SelectionBoxInputHandler.js';

class SelectionBoxLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        const inputController = props.inputController;
        const graphController = props.graphController;

        this._selectionBox = new SelectionBox();
        this._selectionBoxInputHandler = new SelectionBoxInputHandler(inputController, graphController, this._selectionBox);
    }

    /** @override */
    componentDidMount()
    {
        const inputController = this.props.inputController;
        if (inputController)
        {
            inputController.setSelectionBox(this._selectionBox);
        }

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
        this._selectionBox.clearSelection();

        const inputContext = this.props.inputContext;
        if (inputContext)
        {
            inputContext.removeInputHandler(this._selectionBoxInputHandler);
        }
    }

    getSelectionBox() { return this._selectionBox; }
    getSelectionBoxInputHandler() { return this._selectionBoxInputHandler; }

    /** @override */
    render()
    {
        const selectionBox = this._selectionBox;
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
SelectionBoxLayer.propTypes = {
    // TODO: Fix types.
    inputController: PropTypes.any,
    graphController: PropTypes.any,
    inputContext: PropTypes.any,
    inputPriority: PropTypes.any,
};

export default SelectionBoxLayer;
