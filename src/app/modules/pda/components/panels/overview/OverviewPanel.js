import React from 'react';
import Style from './OverviewPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';
import PanelDivider from 'experimental/panels/PanelDivider.js';
import PanelSwitch from 'experimental/panels/PanelSwitch.js';

import StateListView from './states/StateListView.js';
import AlphabetListView from './alphabet/AlphabetListView.js';
import StackAlphabetListView from './stackalphabet/StackAlphabetListView.js';
import AutoStateLabelView from './AutoStateLabelView.js';

class OverviewPanel extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onAutoLayoutApply = this.onAutoLayoutApply.bind(this);
        this.onAutoLayoutChange = this.onAutoLayoutChange.bind(this);
        this.onAutoLabelChange = this.onAutoLabelChange.bind(this);
        this.onSnapToGridChange = this.onSnapToGridChange.bind(this);
    }

    onAutoLayoutApply(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
        const graphController = currentModule.getGraphController();
        graphController.applyAutoLayout();
    }

    onAutoLayoutChange(e)
    {
    //TODO: Not yet implemented...
    }

    onAutoLabelChange(e)
    {
        const session = this.props.session;
        const currentModule = session.getCurrentModule();
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
        const autoRename = graphController.shouldAutoRenameNodes();

        const drawerFull = drawer.isDrawerFullscreen();

        return (
            <PanelContainer id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={OverviewPanel.TITLE}>

                <PanelSection title={'States'} initial={true} full={drawerFull}>
                    <StateListView graphController={graphController}/>
                </PanelSection>
                <PanelSection title={'Alphabet'} initial={true} full={drawerFull}>
                    <AlphabetListView machineController={machineController}/>
                </PanelSection>
                <PanelSection title={'Stack Alphabet'} initial={true} full={drawerFull}>
                    <StackAlphabetListView machineController={machineController}/>
                </PanelSection>

                <PanelDivider/>

                <AutoStateLabelView graphController={graphController}/>

                <button className={Style.autolayout_button} onClick={this.onAutoLayoutApply} disabled={graphController.getGraph().isEmpty()}>
                    {I18N.toString('action.overview.autolayout')}
                </button>

                <PanelDivider/>

                <PanelSwitch id={'overview-auto-label'}
                    checked={autoRename}
                    title={'Auto rename nodes'}
                    onChange={this.onAutoLabelChange}/>
                <PanelSwitch id={'overview-auto-layout'}
                    checked={false}
                    title={'Auto layout nodes'}
                    disabled={true}
                    onChange={this.onAutoLayoutChange}/>
                <PanelSwitch id={'overview-snap-grid'}
                    checked={false}
                    title={'Snap-to-grid'}
                    disabled={true}
                    onChange={this.onSnapToGridChange}/>

            </PanelContainer>
        );
    }
}
Object.defineProperty(OverviewPanel, 'TITLE', {
    get: function() { return I18N.toString('component.overview.title'); }
});

export default OverviewPanel;
