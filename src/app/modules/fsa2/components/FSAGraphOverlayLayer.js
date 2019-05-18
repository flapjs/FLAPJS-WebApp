import React from 'react';

import ViewportLayer from 'graph2/components/layers/ViewportLayer.js';
import ViewportNavigationLayer from 'graph2/components/layers/ViewportNavigationLayer.js';
import LabelEditorView from 'graph2/components/views/LabelEditorView.js';

import FSALabelEditorRenderer from '../graph/widgets/FSALabelEditorRenderer.js';

class FSAGraphOverlayLayer extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const graphView = this.props.graphView;
        const graphController = this.props.graphController;
        const labelFormatter = graphController.getLabelFormatter();
        const currentModule = this.props.module;

        return (
            <React.Fragment>
                <ViewportLayer
                    graphController={graphController}
                    inputController={graphView.getInputController()}
                    viewport={graphView.getViewportComponent()}>
                    <ViewportNavigationLayer
                        style={{ right: 0 }}
                        viewportAdapter={graphView.getViewportComponent().getViewportAdapter()} />
                </ViewportLayer>
                <LabelEditorView ref={ref => graphController.setLabelEditor(ref)}
                    labelFormatter={labelFormatter}
                    viewport={graphView.getViewportComponent()}
                    saveOnExit={true}>
                    <FSALabelEditorRenderer graphController={graphController} currentModule={currentModule} />
                </LabelEditorView>
            </React.Fragment>
        );
    }
}

export default FSAGraphOverlayLayer;