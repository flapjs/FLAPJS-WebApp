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

        this.onTrashChange = this.onTrashChange.bind(this);
    }

    onTrashChange(enabled)
    {

    }

    /** @override */
    render()
    {
        return (
            <SessionConsumer>
                {
                    session =>
                        <>
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
                }
            </SessionConsumer>
        );
    }
}

export default BaseViewportLayer;
