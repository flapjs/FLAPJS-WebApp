import React from 'react';
import PanelContainer from 'experimental/panels/PanelContainer.js';

import MachineController from './MachineController.js';
import CFGErrorChecker from './CFGErrorChecker.js';
// import { RENDER_LAYER_WORKSPACE } from 'session/manager/RenderManager.js';

import { registerNotifications } from './components/notifications/CFGNotifications.js';

import OverviewPanel from './components/panels/overview/OverviewPanel.js';
import AnalysisPanel from './components/panels/analysis/AnalysisPanel.js';

import { CTRL_KEY, SHIFT_KEY } from 'session/manager/hotkey/HotKeyManager.js';

const MODULE_NAME = 'cfg';
const MODULE_VERSION = '1.0.0';
const MODULE_LOCALIZED_NAME = 'Context-Free Grammar';

class CFGModule
{
    constructor(app)
    {
        this._app = app;

        this._machineController = new MachineController();
        this._errorChecker = new CFGErrorChecker(app,
            this._machineController);

        /*
        app.getRenderManager()
            .addRenderer(CFGNDER_LAYER_WORKSPACE, props => <ExpressionView session={app.getSession()} />);
        */
    }

    /** @override */
    initialize(app)
    {
        registerNotifications(app.getNotificationManager());

        app.getDrawerManager()
            .addPanelClass(props => (
                <PanelContainer id={props.id}
                    className={props.className}
                    style={props.style}
                    title={'Regular Expressions'}>
                    <p>{'Brought to you with \u2764 by the Flap.js team.'}</p>
                    <p>{'<- Tap on a tab to begin!'}</p>
                </PanelContainer>
            ))
            .addPanelClass(OverviewPanel)
            .addPanelClass(AnalysisPanel);

        /*
        app.getUndoManager()
            .setEventHandlerFactory((...args) =>
                new SafeExpressionEventHandler(this._machineController));
        */

        /*
        app.getExportManager()
            .registerExporter(new CFGExporter(), 'session')
            .registerExporter(new CFGToFSAExporter(), 're2fsa');

        app.getImportManager()
            .addImporter(new CFGImporter(app), '.re.json', '.json');
        */

        app.getHotKeyManager()
            .registerHotKey('Save as JSON', [CTRL_KEY, 'KeyS'], () => { app.getExportManager().tryExportFile('session', app.getSession()); })
            .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => { this.clear(app); })
            .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => { app.getUndoManager().undo(); })
            .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => { app.getUndoManager().redo(); });
    }

    /** @override */
    update(app)
    {
        this._machineController.update();
    }

    /** @override */
    destroy(app)
    {
    }

    /** @override */
    clear(app)
    {
        if (window.confirm(I18N.toString('alert.graph.clear')))
        {
            this._machineController.setMachineExpression('');
            app.getUndoManager().clear();
            app.getSession().setProjectName(null);
            app.getToolbarComponent().closeBar();
        }
    }

    getMachineController() { return this._machineController; }
    getErrorChecker() { return this._errorChecker; }

    /** @override */
    getModuleVersion() { return MODULE_VERSION; }
    /** @override */
    getModuleName() { return MODULE_NAME; }
    /** @override */
    getLocalizedModuleName() { return MODULE_LOCALIZED_NAME; }
    /** @override */
    getApp() { return this._app; }
}

export default CFGModule;
