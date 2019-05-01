import React from 'react';
import Style from './AnalysisPanel.css';

import { getUnreachableNodes } from 'modules/fsa2/graph/FSAGraphUtil.js';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelCheckbox from 'experimental/panels/PanelCheckbox.js';

import { MACHINE_CONVERSION_LAYOUT_ID, MACHINE_CONVERSION_NOTIFICATION_TAG }
    from 'modules/fsa2/components/notifications/FSANotifications.js';

class AnalysisPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.optimizeUnreachOption = null;
        this.optimizeRedundOption = null;

        this.onConvertToDFA = this.onConvertToDFA.bind(this);
        this.onConvertToNFA = this.onConvertToNFA.bind(this);
        this.onInvertDFA = this.onInvertDFA.bind(this);

        this.onOptimizeMachine = this.onOptimizeMachine.bind(this);
    }

    onDeleteAllUnreachable(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const unreachableArray = getUnreachableNodes(graphController.getGraph());
        graphController.deleteTargetNodes(unreachableArray);
    }

    onConvertToDFA(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const props = { graphController: graphController, machineController: machineController };

        //Will do: machineController.convertMachineTo("DFA");
        session.getApp().getNotificationManager().pushNotification(
            I18N.toString('message.warning.convertNFAToDFA'),
            MACHINE_CONVERSION_LAYOUT_ID, MACHINE_CONVERSION_NOTIFICATION_TAG, props, true
        );
    }

    onConvertToNFA(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        machineController.convertMachineTo('NFA');
    }

    onInvertDFA(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        machineController.invertMachine();
    }

    onOptimizeMachine(e)
    {
        if (this.optimizeUnreachOption.isChecked())
        {
            this.onDeleteAllUnreachable(e);
        }
    }

    canOptimize()
    {
        return (this.optimizeRedundOption && this.optimizeRedundOption.isChecked()) ||
            (this.optimizeUnreachOption && this.optimizeUnreachOption.isChecked());
    }

    /** @override */
    render()
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();

        return (
            <PanelContainer id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={AnalysisPanel.TITLE}>
                <PanelSection title={'Optimizations'} initial={true}>
                    <PanelCheckbox ref={ref => this.optimizeUnreachOption = ref}
                        id="opt-unreach" title="Unreachables" value="unreach" />
                    <PanelCheckbox ref={ref => this.optimizeRedundOption = ref} disabled={true}
                        id="opt-redund" title="Redundant States" value="redund" />
                    <button className={Style.analysis_button} onClick={this.onOptimizeMachine} disabled={!this.canOptimize()}>Optimize</button>
                    {
                        machineController.getMachineType() == 'DFA' ?
                            <button className={Style.analysis_button} onClick={this.onConvertToNFA}>
                                {I18N.toString('action.overview.convertnfa')}
                            </button>
                            : machineController.getMachineType() == 'NFA' ?
                                <button className={Style.analysis_button} onClick={this.onConvertToDFA}>
                                    {I18N.toString('action.overview.convertdfa')}
                                </button>
                                : null
                    }
                </PanelSection>
                <PanelSection title={'Related Machines'}>
                    {machineController.getMachineType() === 'DFA' &&
                        <button className={Style.analysis_button} onClick={this.onInvertDFA}>
                            {'Flip all accept states'}
                        </button>}
                </PanelSection>
            </PanelContainer>
        );
    }
}
Object.defineProperty(AnalysisPanel, 'TITLE', {
    get: function () { return I18N.toString('component.analysis.title'); }
});

export default AnalysisPanel;
