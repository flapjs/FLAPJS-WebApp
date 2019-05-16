import React from 'react';
// import Style from './OverviewPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import PanelSection from 'experimental/panels/PanelSection.js';

import AlphabetListView from './alphabet/AlphabetListView.js';

import {EMPTY, CONCAT, UNION, KLEENE, SIGMA, EMPTY_SET, PLUS} from 'modules/re/machine/RE.js';

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
                <PanelSection title={'Terminals'} initial={true} full={drawerFull}>
                    <AlphabetListView machineController={machineController}/>
                </PanelSection>
                <PanelSection title={'Symbol Key'} initial={true} full={true}>
                    <table>
                        <tbody>
                            <tr><td>Epsilon</td><td>{EMPTY}</td></tr>
                            <tr><td>Union</td><td>{UNION}</td></tr>
                            <tr><td>Concat</td><td>{CONCAT}</td></tr>
                            <tr><td>Kleene Star</td><td>{KLEENE}</td></tr>
                            <tr><td>Kleene Plus</td><td>{PLUS}</td></tr>
                            <tr><td>Sigma</td><td>{SIGMA}</td></tr>
                            <tr><td>Empty Set</td><td>{EMPTY_SET}</td></tr>
                        </tbody>
                    </table>
                </PanelSection>
            </PanelContainer>
        );
    }
}
Object.defineProperty(OverviewPanel, 'TITLE', {
    get: function() { return I18N.toString('component.overview.title'); }
});

export default OverviewPanel;
