import React from 'react';
import PropTypes from 'prop-types';

import { SessionConsumer } from '@flapjs/session/context/SessionContext.jsx';

import LabelEditorWidget from '@flapjs/systems/graph/components/widgets/LabelEditorWidget.jsx';
import TrashCanWidget from '@flapjs/systems/graph/components/widgets/TrashCanWidget.jsx';
import ModeTrayWidget, { MODE_MOVE, MODE_ACTION } from '@flapjs/systems/graph/components/widgets/ModeTrayWidget.jsx';
import ZoomWidget from '@flapjs/systems/graph/components/widgets/ZoomWidget.jsx';
import FocusCenterWidget from '@flapjs/systems/graph/components/widgets/FocusCenterWidget.jsx';

class GraphViewportLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onTrashModeClick = this.onTrashModeClick.bind(this);
        this.onClearGraphClick = this.onClearGraphClick.bind(this);
        this.onActionModeClick = this.onActionModeClick.bind(this);
    }

    onTrashModeClick(session, dispatch, value)
    {
        session.inputController.setTrashMode(value);
        dispatch({ type: 'setState', value: { trashMode: value } });
    }

    onClearGraphClick(session, dispatch)
    {
        session.graphController.clearGraph();
        dispatch({ type: 'setState', value: { graphHash: session.graphController.getGraph().getHashCode() } });
    }

    onActionModeClick(session, dispatch, value)
    {
        session.inputController.setMoveModeFirst(value === MODE_MOVE);
        dispatch({ type: 'setState', value: { actionMode: value } });
    }

    centerView(session)
    {
        session.viewController.centerView(0, 0);
    }

    /** @override */
    render()
    {
        const props = this.props;
        return (
            <SessionConsumer>
                {
                    (session, dispatch) =>
                    {
                        const graph = session.graphController.getGraph();
                        const viewController = session.viewController;
                        const visible = !graph.isEmpty()
                            && (
                                !viewController.getInputAdapter().isUsingTouch()
                                || !viewController.getInputAdapter().isDragging()
                            );

                        const inputController = session.inputController;
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
                                    onChange={value => this.onTrashModeClick(session, dispatch, value)}
                                    onClear={() => this.onClearGraphClick(session, dispatch)}
                                    visible={visible} />
                                <ModeTrayWidget style={{ position: 'absolute', bottom: 0, left: 0 }}
                                    value={actionMode}
                                    onChange={value => this.onActionModeClick(session, dispatch, value)} />
                                <ZoomWidget style={{ position: 'absolute', top: 0, right: 0 }}
                                    viewportAdapter={session.viewController.getViewportAdapter()} />
                                <FocusCenterWidget style={{ position: 'absolute', top: 64, right: 0 }}
                                    viewportAdapter={session.viewController.getViewportAdapter()} />
                                <LabelEditorWidget ref={ref => session.graphController && session.graphController.setLabelEditor(ref)}
                                    labelFormatter={session.graphController.getLabelFormatter()}
                                    viewController={session.viewController}
                                    saveOnExit={true}>
                                </LabelEditorWidget>
                                {props.children}
                            </>
                        );
                    }
                }
            </SessionConsumer>
        );
    }
}
GraphViewportLayer.propTypes = {
    children: PropTypes.node
};

export default GraphViewportLayer;
