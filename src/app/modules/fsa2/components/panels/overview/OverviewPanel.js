import React from 'react';
import Style from './OverviewPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import StateListView from './states/StateListView.js';
import AlphabetListView from './alphabet/AlphabetListView.js';
import TransitionChartView from './transitions/TransitionChartView.js';
import TransitionTableView from './transitions/TransitionTableView.js';
import AutoStateLabelView from './AutoStateLabelView.js';

const MACHINE_TYPE_DFA = 'DFA';
const MACHINE_TYPE_NFA = 'NFA';

class OverviewPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onMachineTypeChange = this.onMachineTypeChange.bind(this);
        this.onAutoLayoutApply = this.onAutoLayoutApply.bind(this);
        this.onAutoLayoutChange = this.onAutoLayoutChange.bind(this);
        this.onAutoLabelChange = this.onAutoLabelChange.bind(this);
        this.onSnapToGridChange = this.onSnapToGridChange.bind(this);
    }

    onMachineTypeChange(e)
    {
        const newValue = e.target.value;

        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const machineController = currentModule.getMachineController();
        const machine = machineController.getMachineBuilder().getMachine();

        switch (newValue)
        {
        case MACHINE_TYPE_DFA:
            machine.setDeterministic(true);
            break;
        case MACHINE_TYPE_NFA:
            machine.setDeterministic(false);
            break;
        default:
            throw new Error('Unknown machine type \'' + newValue + '\'');
        }
    }

    onAutoLayoutApply(e)
    {
        const currentModule = this.props.session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        graphController.applyAutoLayout();
    }

    onAutoLayoutChange(e)
    {
        //TODO: Not yet implemented...
    }

    onAutoLabelChange(e)
    {
        const currentModule = this.props.session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        graphController.setAutoRenameNodes(e.target.checked);
    }

    onSnapToGridChange(e)
    {
        //TODO: Not yet implemented...
    }

    /** @override */
    render()
    {
        const drawer = this.props.drawer;
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        const machineController = currentModule.getMachineController();
        const graphView = currentModule.getGraphView();
        const machineType = machineController.getMachineBuilder().getMachine().isDeterministic() ? MACHINE_TYPE_DFA : MACHINE_TYPE_NFA;
        const autoRename = graphController.shouldAutoRenameNodes();

        const drawerFull = drawer.isDrawerFullscreen();

        return (
            <PanelContainer id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={OverviewPanel.TITLE}>

                <select className={Style.machine_type_select}
                    value={machineType}
                    onChange={this.onMachineTypeChange}>
                    <option>{MACHINE_TYPE_DFA}</option>
                    <option>{MACHINE_TYPE_NFA}</option>
                </select>

                <PanelDivider />

                <PanelSection title={'States'} initial={true} full={drawerFull}>
                    <StateListView graphController={graphController} graphView={graphView} />
                </PanelSection>
                <PanelSection title={'Alphabet'} initial={true} full={drawerFull}>
                    <AlphabetListView machineController={machineController} />
                </PanelSection>

                <PanelDivider />

                <PanelSection title={'Transition Chart'} full={drawerFull} disabled={graphController.getGraph().getEdgeCount() <= 0}>
                    <TransitionChartView machineController={machineController} />
                </PanelSection>
                <PanelSection title={'Transition Table'} full={drawerFull} disabled={graphController.getGraph().getNodeCount() <= 0}>
                    <TransitionTableView machineController={machineController} />
                </PanelSection>

                <PanelDivider />

                <AutoStateLabelView graphController={graphController} />

                <button className={Style.autolayout_button}
                    onClick={this.onAutoLayoutApply}
                    disabled={graphController.getGraph().isEmpty()}>
                    {I18N.toString('action.overview.autolayout')}
                </button>

                <PanelDivider />

                <PanelSwitch id={'overview-auto-label'}
                    checked={autoRename}
                    title={'Auto rename nodes'}
                    onChange={this.onAutoLabelChange} />
                <PanelSwitch id={'overview-auto-layout'}
                    checked={false}
                    title={'Auto layout nodes'}
                    disabled={true}
                    onChange={this.onAutoLayoutChange} />
                <PanelSwitch id={'overview-snap-grid'}
                    checked={false}
                    title={'Snap-to-grid'}
                    disabled={true}
                    onChange={this.onSnapToGridChange} />

            </PanelContainer>
        );
    }
}
Object.defineProperty(OverviewPanel, 'TITLE', {
    get: function () { return I18N.toString('component.overview.title'); }
});

export default OverviewPanel;
