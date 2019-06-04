import React from 'react';
import Style from './TestingPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import TestListView from './TestListView.js';

import { MACHINE_ERROR_NOTIFICATION_TAG } from 'modules/fsa2/components/notifications/FSANotifications.js';

class TestingPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            stepMode: false
        };

        this.onStepTestChange = this.onStepTestChange.bind(this);
        this.onAutoErrorCheckChange = this.onAutoErrorCheckChange.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        //TODO: This should be in modules...
        const session = this.props.session;
        const app = session.getApp();
        const currentModule = session.getCurrentModule();
        const tester = currentModule._tester;
        tester.on('startTest', (tester) => 
        {
            currentModule._testMode = true;
            app._drawer.setDrawerSoloClass(TestingPanel);
            app._drawer.closeDrawer();
        });
        tester.on('stopTest', (tester) => 
        {
            currentModule._testMode = false;
            app._drawer.setDrawerSoloClass(null);
            app._drawer.openDrawer();
        });
    }

    onStepTestChange(e)
    {
        this.setState((prev, props) => 
        {
            return { stepMode: !prev.stepMode };
        });
    }

    onAutoErrorCheckChange(e)
    {
        const currentModule = this.props.session.getCurrentModule();
        const errorChecker = currentModule.getErrorChecker();
        const errorCheck = errorChecker.isErrorChecking();
        errorChecker.setErrorChecking(!errorCheck);
        if (errorCheck)
        {
            // Turning it off
            this.props.session.getApp().getNotificationManager().clearNotifications(MACHINE_ERROR_NOTIFICATION_TAG);
        }
        else
        {
            // Run it at least once on start
            errorChecker.showErrors();
        }
    }

    /** @override */
    render()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const tester = currentModule.getStringTester();
        const errorChecker = currentModule.getErrorChecker();

        const stepMode = this.state.stepMode;
        const errorCheck = errorChecker.isErrorChecking();

        return (
            <PanelContainer id={this.props.id}
                className={Style.panel_container +
                    ' ' + this.props.className}
                style={this.props.style}
                title={TestingPanel.TITLE}>

                <TestListView tester={tester} graphController={graphController} machineController={machineController} immediate={!stepMode} />
                <PanelSwitch id={'testing-step-test'} checked={stepMode} onChange={this.onStepTestChange} title={'Step testing'} />
                <PanelSwitch id={'testing-error-check'} checked={errorCheck} onChange={this.onAutoErrorCheckChange} title={'Auto error checking'} />

            </PanelContainer>
        );
    }
}
Object.defineProperty(TestingPanel, 'TITLE', {
    get: function () { return I18N.toString('component.testing.title'); }
});

export default TestingPanel;
