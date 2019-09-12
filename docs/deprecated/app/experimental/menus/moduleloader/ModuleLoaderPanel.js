import React from 'react';
import Style from './ModuleLoaderPanel.css';

import PanelContainer from 'experimental/panels/PanelContainer.js';
import IconButton from 'experimental/components/IconButton.js';

import Modules from 'modules/Modules.js';

class ModuleLoaderPanel extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    renderModuleButton(moduleKey, moduleInfo)
    {
        const session = this.props.session;
        const app = session.getApp();
        const useExperimental = app.isExperimental();

        return (
            <IconButton key={moduleKey}
                className={Style.module_button}
                title={moduleInfo.name + ' (' + moduleInfo.version + ')'}
                disabled={moduleInfo['experimental'] !== useExperimental || moduleInfo['disabled']}
                onClick={(e) => 
                {
                    session.restartSession(session.getApp(), moduleKey);
                }}>
            </IconButton>
        );
    }

    /** @override */
    render()
    {
        //const session = this.props.session;

        return (
            <PanelContainer
                id={this.props.id}
                className={this.props.className}
                style={this.props.style}
                title={'Change Modules'}>
                <div className={Style.module_button_list}>
                    {Object.keys(Modules).map(e => this.renderModuleButton(e, Modules[e]))}
                </div>
            </PanelContainer>
        );
    }
}

export default ModuleLoaderPanel;
