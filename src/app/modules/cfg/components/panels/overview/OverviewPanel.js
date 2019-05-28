import React from 'react';
// import Style from './OverviewPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';

import AlphabetListView from './alphabet/AlphabetListView.js';

class OverviewPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const drawer = this.props.drawer;
        const session = this.props.session;
        const currentModule = session.getCurrentModule();

        const machineController = currentModule.getMachineController();
        const drawerFull = drawer.isDrawerFullscreen();

        return (
            <PanelContainer id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={OverviewPanel.TITLE}>
                <PanelSection title={'Variables'} initial={true} full={drawerFull}>
                    <AlphabetListView content="variables" machineController={machineController}/>
                </PanelSection>
                <PanelSection title={'Terminals'} initial={true} full={drawerFull}>
                    <AlphabetListView content="terminals" machineController={machineController}/>
                </PanelSection>
            </PanelContainer>
        );
    }
}
Object.defineProperty(OverviewPanel, 'TITLE', {
    get: function() { return I18N.toString('component.overview.title'); }
});

export default OverviewPanel;
