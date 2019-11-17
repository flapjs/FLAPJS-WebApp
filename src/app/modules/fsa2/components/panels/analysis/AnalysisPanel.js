import React from 'react';
import Style from './AnalysisPanel.css';
import { getUnreachableNodes } from 'graph2/util/NodeGraphUtils.js';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelCheckbox from 'experimental/panels/PanelCheckbox.js';
import { isEquivalentFSAWithWitness } from 'modules/fsa2/machine/util/EqualFSA';
import { MACHINE_CONVERSION_LAYOUT_ID, MACHINE_CONVERSION_NOTIFICATION_TAG } from 'modules/fsa2/components/notifications/FSANotifications.js';

import { createMachineFromFileBlob } from './MachineLoader.js';

class AnalysisPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            isEqual: null,
            witnessString: ''
        };

        this.optimizeUnreachOption = null;
        this.optimizeRedundOption = null;

        this.onConvertToDFA = this.onConvertToDFA.bind(this);
        this.onConvertToNFA = this.onConvertToNFA.bind(this);
        this.onInvertDFA = this.onInvertDFA.bind(this);
        this.onEquivalentTest = this.onEquivalentTest.bind(this);

        this.onOptimizeMachine = this.onOptimizeMachine.bind(this);

        this.onFileUpload = this.onFileUpload.bind(this);
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

        // Will do: machineController.convertMachineTo("DFA");
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

    onEquivalentTest(e)
    {
        createMachineFromFileBlob(e)
            .then(result =>
            {
                const session = this.props.session;
                const currentModule = session.getCurrentModule();
                const machineController = currentModule.getMachineController();
                const machineBuilder = machineController.getMachineBuilder();
                const currentMachine = machineBuilder.getMachine();
                const equivalenceResult = isEquivalentFSAWithWitness(result, currentMachine);
                if (equivalenceResult.value)
                {
                    this.setState({ isEqual: true, witnessString: '' });
                }
                else
                {
                    if(!equivalenceResult.witnessString)
                    {
                        this.setState({ isEqual: false, witnessString: 'Sorry, the machines have different alphabets' });
                    }
                    else
                    {
                        this.setState({ isEqual: false, witnessString: 'Witness: ' + equivalenceResult.witnessString });
                    }
                }
            })
            .catch(err =>
            {
                this.setState({ isEqual: null, witnessString: err.message });
            });
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

    onFileUpload(e)
    {
        const files = e.target.files;
        if (files.length > 0)
        {
            this.onEquivalentTest(files[0]);

            //Makes sure you can upload the same file again.
            e.target.value = '';
        }
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
                <PanelSection title={'Equivalent Test'}>
                    <input type="file" name="import"
                        className={Style.upload_input}
                        onChange={this.onFileUpload}/>
                    <div>
                        <label>
                            {
                                this.state.isEqual === null
                                    ? '-- ??? --'
                                    : this.state.isEqual
                                        ? '-- Equivalent --'
                                        : '-- Not Equivalent --'
                            }
                        </label>
                    </div>
                    <div>
                        <label>{this.state.witnessString}</label>
                    </div>
                </PanelSection>
            </PanelContainer>
        );
    }
}
Object.defineProperty(AnalysisPanel, 'TITLE', {
    get: function () { return I18N.toString('component.analysis.title'); }
});

export default AnalysisPanel;
