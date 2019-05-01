import React from 'react';
import Style from 'experimental/viewport/ViewportView.css';

import NavbarWidget from 'experimental/widgets/NavbarWidget.js';

class StepTracerView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    componentDidMount()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const inputController = currentModule.getInputController();

        inputController.setDisabled(true);
    }

    /** @override */
    componentWillUnmount()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const inputController = currentModule.getInputController();

        inputController.setDisabled(false);
    }

    /** @override */
    render()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const app = session.getApp();

        const viewport = this.props.viewport;
        const stepTracer = currentModule._stepTracer;
        const inputController = currentModule.getInputController();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();

        return (
            <div id={this.props.id}
                className={Style.view_pane +
          ' ' + this.props.className}
                style={this.props.style}>
                <NavbarWidget className={Style.view_widget} style={{right: 0}}
                    app={app}/>
                <div className={Style.view_widget} style={{bottom: 0}}>
                    {stepTracer.getCurrentSymbols().join('')}
                    <button>Next</button>
                    <button onClick={e => {viewport.setCurrentView(0);}}>Back</button>
                </div>
            </div>
        );
    }
}

export default StepTracerView;
