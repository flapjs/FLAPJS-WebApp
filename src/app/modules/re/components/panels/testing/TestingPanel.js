import React from 'react';
import Style from './TestingPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import TestListView from './TestListView.js';

import {MACHINE_ERROR_NOTIFICATION_TAG} from 'modules/re/components/notifications/RENotifications.js';

class TestingPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onAutoErrorCheckChange = this.onAutoErrorCheckChange.bind(this);
    }

    onAutoErrorCheckChange(e)
    {
        const currentModule = this.props.session.getCurrentModule();
        const errorChecker = currentModule.getErrorChecker();
        const errorCheck = errorChecker.isErrorChecking();
        errorChecker.setErrorChecking(!errorCheck);
        if (errorCheck)
        {
            //Turning it off
            this.props.session.getApp().getNotificationManager().clearNotifications(MACHINE_ERROR_NOTIFICATION_TAG);
        }
        else
        {
            const machineController = currentModule.getMachineController();
            errorChecker.onExpressionChange(machineController.getMachineExpression());
        }
    }

    /** @override */
    render()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const errorChecker = currentModule.getErrorChecker();

        const errorCheck = errorChecker.isErrorChecking();

        return (
            <PanelContainer id={this.props.id}
                className={Style.panel_container +
          ' ' + this.props.className}
                style={this.props.style}
                title={TestingPanel.TITLE}>

                <TestListView machineController={machineController}/>
                <PanelSwitch id={'testing-error-check'} checked={errorCheck} onChange={this.onAutoErrorCheckChange} title={'Auto error checking'}/>

            </PanelContainer>
        );
    }
}
Object.defineProperty(TestingPanel, 'TITLE', {
    get: function() { return I18N.toString('component.testing.title'); }
});

export default TestingPanel;
