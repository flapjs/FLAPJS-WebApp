import React from 'react';
import Style from './AnalysisPanel.css';
import StyleTest from '../Testing/TestListView.css';
import { getUnreachableNodes } from 'graph2/util/NodeGraphUtils.js';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelCheckbox from 'experimental/panels/PanelCheckbox.js';
import { isEquivalentFSAWithWitness } from 'modules/fsa2/machine/util/EqualFSA';
import { MACHINE_CONVERSION_LAYOUT_ID, MACHINE_CONVERSION_NOTIFICATION_TAG } from 'modules/fsa2/components/notifications/FSANotifications.js';
import UploadIcon from 'components/iconset/UploadIcon.js';
import IconUploadButton from 'experimental/components/IconUploadButton.js';
import MachineController from '../../../machine/MachineController';

import TextUploader from 'util/file/import/TextUploader.js';
import FSABuilder from 'modules/fsa2/machine/FSABuilder.js';

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
        const textUploader = new TextUploader();

        textUploader.uploadFile(e)
            .then(result =>
            {
                const fileName = e.name;
                const fileData = JSON.parse(result);
                const machineData = fileData['machineData'];

                const machineBuilder = new FSABuilder();
                console.log(machineBuilder.getMachine());

                const machineType = machineData.type;
                if (machineType) machineBuilder.getMachine().setDeterministic(machineType === 'DFA');

                const customSymbols = machineData.symbols;
                if (customSymbols && Array.isArray(customSymbols))
                {
                    machineBuilder.getMachine().clearCustomSymbols();
                    for(const symbol of customSymbols)
                    {
                        machineBuilder.getMachine().setCustomSymbol(symbol);
                    }
                }

                
                const machine = machineBuilder.getMachine();
                const currentMachine = this.props.machineController.getMachine();
                console.log(machine, currentMachine);
                const equivalenceResult = isEquivalentFSAWithWitness(machine, currentMachine);
                console.log(equivalenceResult);
            })
            .catch(err =>
            {
                throw new Error('Failed to import file: ' + err.message);
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
                </PanelSection>
            </PanelContainer>
        );
    }
}
Object.defineProperty(AnalysisPanel, 'TITLE', {
    get: function () { return I18N.toString('component.analysis.title'); }
});

export default AnalysisPanel;
