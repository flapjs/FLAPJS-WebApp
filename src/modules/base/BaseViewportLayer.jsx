import React from 'react';

//import ModeTrayWidget from '@flapjs/deprecated/graph/components/widgets/ModeTrayWidget.jsx';
// import ViewportEditLayer from '@flapjs/deprecated/graph/components/layers/ViewportEditLayer.jsx';
//import ViewportNavigationLayer from '@flapjs/deprecated/graph/components/layers/ViewportNavigationLayer.jsx';
//import LabelEditorWidget from '@flapjs/deprecated/graph/components/widgets/LabelEditorWidget.jsx';
import { SessionConsumer } from '@flapjs/contexts/session/SessionContext.jsx';

class BaseViewportLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            trashMode: false
        };

        this.onTrashChange = this.onTrashChange.bind(this);
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

    centerView(session)
    {
        const graphView = session.graphView.current;
        const viewport = graphView.getViewportComponent();
        const viewportAdapter = viewport.getViewportAdapter();
        viewportAdapter.setOffset(0, 0);
    }

    /** @override */
    render()
    {
        return (
            <SessionConsumer>
                {
                    session =>
                    {
                        session.inputController.setTrashMode(this.state.trashMode);
                        return (
                            <>
                                <button onClick={this.onTrashChange}>Delete Mode</button>
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
