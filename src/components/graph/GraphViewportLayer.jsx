import React from 'react';
import PropTypes from 'prop-types';

import LabelEditorWidget from '@flapjs/services/graph/components/widgets/LabelEditorWidget.jsx';
import TrashCanWidget from '@flapjs/services/graph/components/widgets/TrashCanWidget.jsx';
import ModeTrayWidget, { MODE_MOVE, MODE_ACTION } from '@flapjs/services/graph/components/widgets/ModeTrayWidget.jsx';
import ZoomWidget from '@flapjs/services/graph/components/widgets/ZoomWidget.jsx';
import FocusCenterWidget from '@flapjs/services/graph/components/widgets/FocusCenterWidget.jsx';
import GraphService from '@flapjs/services/GraphService.js';

class GraphViewportLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onTrashModeClick = this.onTrashModeClick.bind(this);
        this.onClearGraphClick = this.onClearGraphClick.bind(this);
        this.onActionModeClick = this.onActionModeClick.bind(this);
    }

    onTrashModeClick(graphService, dispatch, value)
    {
        graphService.inputController.setTrashMode(value);
        dispatch({ type: 'setState', value: { trashMode: value } });
    }

    onClearGraphClick(graphService, dispatch)
    {
        graphService.graphController.clearGraph();
        dispatch({ type: 'setState', value: { graphHash: graphService.graphController.getGraph().getHashCode() } });
    }

    onActionModeClick(graphService, dispatch, value)
    {
        graphService.inputController.setMoveModeFirst(value === MODE_MOVE);
        dispatch({ type: 'setState', value: { actionMode: value } });
    }

    centerView(graphService)
    {
        graphService.viewController.centerView(0, 0);
    }

    /** @override */
    render()
    {
        const props = this.props;
        return (
            <GraphService.CONTEXT.Consumer>
                {
                    (graphService, dispatch) =>
                    {
                        const graph = graphService.graphController.getGraph();
                        const viewController = graphService.viewController;
                        const visible = !graph.isEmpty()
                            && (
                                !viewController.getInputAdapter().isUsingTouch()
                                || !viewController.getInputAdapter().isDragging()
                            );

                        const inputController = graphService.inputController;
                        let actionMode;
                        if (inputController.isHandlingInput())
                        {
                            actionMode = inputController.isMoveMode(viewController.getInputAdapter()) ? MODE_MOVE : MODE_ACTION;
                        }
                        else
                        {
                            actionMode = inputController.isMoveModeFirst() ? MODE_MOVE : MODE_ACTION;
                        }

                        return (
                            <>
                                <TrashCanWidget style={{ position: 'absolute', bottom: 0, right: 0 }}
                                    onChange={value => this.onTrashModeClick(graphService, dispatch, value)}
                                    onClear={() => this.onClearGraphClick(graphService, dispatch)}
                                    visible={visible} />
                                <ModeTrayWidget style={{ position: 'absolute', bottom: 0, left: 0 }}
                                    value={actionMode}
                                    onChange={value => this.onActionModeClick(graphService, dispatch, value)} />
                                <ZoomWidget style={{ position: 'absolute', top: 0, right: 0 }}
                                    viewportAdapter={graphService.viewController.getViewportAdapter()} />
                                <FocusCenterWidget style={{ position: 'absolute', top: 64, right: 0 }}
                                    viewportAdapter={graphService.viewController.getViewportAdapter()} />
                                <LabelEditorWidget ref={ref => graphService.graphController && graphService.graphController.setLabelEditor(ref)}
                                    labelFormatter={graphService.graphController.getLabelFormatter()}
                                    viewController={graphService.viewController}
                                    saveOnExit={true}>
                                </LabelEditorWidget>
                                {props.children}
                            </>
                        );
                    }
                }
            </GraphService.CONTEXT.Consumer>
        );
    }
}
GraphViewportLayer.propTypes = {
    children: PropTypes.node
};

export default GraphViewportLayer;
