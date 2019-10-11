import React from 'react';

import { SessionConsumer } from '@flapjs/contexts/session/SessionContext.jsx';

import LabelEditorWidget from '@flapjs/deprecated/graph/components/widgets/LabelEditorWidget.jsx';
import TrashCanWidget from '@flapjs/deprecated/graph/components/widgets/TrashCanWidget.jsx';
import ModeTrayWidget, { MODE_MOVE, MODE_ACTION } from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';
import ZoomWidget from '@flapjs/deprecated/graph/components/widgets/ZoomWidget.jsx';
import FocusCenterWidget from '@flapjs/deprecated/graph/components/widgets/FocusCenterWidget.jsx';

class BaseViewportLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            actionMode: true,
        };

        this.onTrashClear = this.onTrashClear.bind(this);
        this.onModeChange = this.onModeChange.bind(this);
    }

    onTrashClear(session)
    {

    }

    onModeChange(mode)
    {
        this.setState(prev =>
        {
            return {
                actionMode: mode === 'action'
            };
        });
    }

    centerView(session)
    {
        session.viewController.centerView(0, 0);
    }

    /** @override */
    render()
    {
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
                                    onChange={value => dispatch({ type: 'trash-mode', value })}
                                    onClear={() => dispatch({ type: 'clear-graph' })}
                                    visible={visible} />
                                <ModeTrayWidget style={{ position: 'absolute', bottom: 0, left: 0 }}
                                    value={actionMode}
                                    onChange={value => dispatch({ type: 'action-mode', value })}/>
                                <ZoomWidget style={{ position: 'absolute', top: 0, right: 0 }}
                                    viewportAdapter={session.viewController.getViewportAdapter()}/>
                                <FocusCenterWidget style={{ position: 'absolute', top: 64, right: 0 }}
                                    viewportAdapter={session.viewController.getViewportAdapter()}/>
                                <LabelEditorWidget ref={ref => session.graphController.setLabelEditor(ref)}
                                    labelFormatter={session.graphController.getLabelFormatter()}
                                    viewController={session.viewController}
                                    saveOnExit={true}>
                                </LabelEditorWidget>
                            </>
                        );
                    }
                }
            </SessionConsumer>
        );
    }
}

export default BaseViewportLayer;
