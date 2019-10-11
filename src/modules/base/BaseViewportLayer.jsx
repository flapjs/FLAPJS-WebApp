import React from 'react';

//import ModeTrayWidget from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';
// import ViewportEditLayer from '@flapjs/deprecated/graph/components/layers/ViewportEditLayer.jsx';
//import ViewportNavigationLayer from '@flapjs/deprecated/graph/components/layers/ViewportNavigationLayer.jsx';
//import LabelEditorWidget from '@flapjs/deprecated/graph/components/widgets/LabelEditorWidget.jsx';
import { SessionConsumer } from '@flapjs/contexts/session/SessionContext.jsx';
import TrashCanWidget from '@flapjs/deprecated/graph/components/widgets/TrashCanWidget.jsx';
import ModeTrayWidget from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';

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
                        /*
                        const visible = !graph.isEmpty() && viewController &&
                            (!viewController.getInputAdapter().isUsingTouch() || !viewController.getInputAdapter().isDragging());
                        */
                        return (
                            <>
                                <TrashCanWidget style={{ position: 'absolute', bottom: 0, right: 0 }}
                                    onChange={value => dispatch({ type: 'trash-mode', value })}
                                    onClear={() => dispatch({ type: 'clear-graph' })} />
                                <ModeTrayWidget style={{ position: 'absolute', bottom: 0, left: 0 }}
                                    value={session.actionMode}
                                    onChange={value => dispatch({ type: 'action-mode', value })}/>
                                <button onClick={() => this.centerView(session)}>Re-Center</button>
                                {
                                    /*
                                    <ViewportEditLayer
                                        graphController={session.graphController}
                                        inputController={session.inputController}
                                        viewport={session.viewport}
                                        onTrashChange={this.onTrashChange}/>
                                    <ViewportNavigationLayer
                                        style={{ right: 0 }}
                                        viewportAdapter={graphView.getViewportAdapter()} />
                                    <LabelEditorWidget ref={ref => graphController.setLabelEditor(ref)}
                                        labelFormatter={labelFormatter}
                                        viewport={graphView.getViewportComponent()}
                                        saveOnExit={true}>
                                    </LabelEditorWidget>
                                    */
                                }
                            </>
                        );
                    }
                }
            </SessionConsumer>
        );
    }
}

export default BaseViewportLayer;
