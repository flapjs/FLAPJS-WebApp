import React from 'react';

//import ModeTrayWidget from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';
import ViewportEditLayer from '@flapjs/deprecated/graph/components/layers/ViewportEditLayer.jsx';
//import ViewportNavigationLayer from '@flapjs/deprecated/graph/components/layers/ViewportNavigationLayer.jsx';
//import LabelEditorWidget from '@flapjs/deprecated/graph/components/widgets/LabelEditorWidget.jsx';
import { SessionStateConsumer } from '@flapjs/contexts/session/SessionContext.jsx';

class BaseViewportLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            trashMode: false,
            actionMode: true,
        };

        this.onTrashChange = this.onTrashChange.bind(this);
        this.onModeChange = this.onModeChange.bind(this);
    }

    onTrashChange()
    {
        this.setState(prev =>
        {
            return {
                trashMode: !prev.trashMode
            };
        });
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
            <SessionStateConsumer>
                {
                    state =>
                    {
                        state.inputController.setTrashMode(this.state.trashMode);
                        return (
                            <>
                                <ViewportEditLayer
                                    graphController={state.graphController}
                                    inputController={state.inputController}
                                    viewController={state.viewController}
                                    onTrashChange={this.onTrashChange}
                                    onModeChange={this.onModeChange}/>
                                <button onClick={this.onTrashChange}>Delete Mode</button>
                                <button onClick={() => this.centerView(state)}>Re-Center</button>
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
            </SessionStateConsumer>
        );
    }
}

export default BaseViewportLayer;
