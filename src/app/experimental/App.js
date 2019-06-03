import React from 'react';
import { hot } from 'react-hot-loader/root';
import Style from './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from 'experimental/drawer/DrawerView.js';
import ToolbarView from 'experimental/toolbar/ToolbarView.js';
import TooltipView from 'experimental/tooltip/TooltipView.js';
import UploadDropZone from 'experimental/components/UploadDropZone.js';
import NotificationView from 'session/manager/notification/components/NotificationView.js';
import IconButton from 'experimental/components/IconButton.js';
import FullscreenWidget from 'experimental/components/FullscreenWidget.js';

import ExportPanel from 'experimental/menus/export/ExportPanel.js';
import OptionPanel from 'experimental/menus/option/OptionPanel.js';
import LanguagePanel from 'experimental/menus/language/LanguagePanel.js';
import ModuleLoaderPanel from 'experimental/menus/moduleloader/ModuleLoaderPanel.js';

import ToolbarButton, { TOOLBAR_CONTAINER_TOOLBAR, TOOLBAR_CONTAINER_MENU } from 'experimental/toolbar/ToolbarButton.js';
import ToolbarDivider from 'experimental/toolbar/ToolbarDivider.js';
import ToolbarUploadButton from 'experimental/toolbar/ToolbarUploadButton.js';
import PageEmptyIcon from 'components/iconset/PageEmptyIcon.js';
import UndoIcon from 'components/iconset/UndoIcon.js';
import RedoIcon from 'components/iconset/RedoIcon.js';
import UploadIcon from 'components/iconset/UploadIcon.js';
import DownloadIcon from 'components/iconset/DownloadIcon.js';
import BugIcon from 'components/iconset/BugIcon.js';
import WorldIcon from 'components/iconset/WorldIcon.js';
import HelpIcon from 'components/iconset/HelpIcon.js';
import SettingsIcon from 'components/iconset/SettingsIcon.js';
import EditPencilIcon from 'components/iconset/EditPencilIcon.js';

import AppSaver from 'experimental/AppSaver.js';
import ColorSaver from 'experimental/ColorSaver.js';
import * as ColorTransform from 'util/ColorTransform.js';
import LanguageSaver from 'experimental/LanguageSaver.js';

import AutoSave from 'util/storage/AutoSave.js';
import LocalStorage from 'util/storage/LocalStorage.js';

import ExportManager from 'util/file/export/ExportManager.js';
import ImportManager from 'util/file/import/ImportManager.js';

import Session from 'session/Session.js';
import DrawerManager from 'session/manager/DrawerManager.js';
import MenuManager from 'session/manager/MenuManager.js';
import ViewportManager from 'session/manager/ViewportManager.js';
import HotKeyManager, { CTRL_KEY, SHIFT_KEY } from 'session/manager/hotkey/HotKeyManager.js';
import HotKeyView from 'session/manager/hotkey/HotKeyView.js';
import UndoManager from 'session/manager/undo/UndoManager.js';
import RenderManager, {
    RENDER_LAYER_WORKSPACE_PRE,
    RENDER_LAYER_WORKSPACE,
    RENDER_LAYER_WORKSPACE_POST,
} from 'session/manager/RenderManager.js';
import TooltipManager from 'session/manager/TooltipManager.js';
import NotificationManager, { ERROR_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';
import ThemeManager from '../util/theme/ThemeManager';
import BroadcastManager from 'session/manager/broadcast/BroadcastManager.js';
import Broadcast from 'util/broadcast/Broadcast.js';

const BUGREPORT_URL = 'https://goo.gl/forms/XSil43Xl5xLHsa0E2';
const HELP_URL = 'https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md';

const DRAWER_INDEX_ABOUT = 0;

const MENU_INDEX_EXPORT = 0;
const MENU_INDEX_OPTION = 1;
const MENU_INDEX_LANGUAGE = 2;
const MENU_INDEX_MODULE = 3;

const ERROR_UPLOAD_NOTIFICATION_TAG = 'error_upload';

const BROADCAST_CHANNEL_ID = 'flapjs';

function registerAppStyles(themeManager)
{
    themeManager.register('--color-graph-node', 'graph');
    themeManager.register('--color-graph-text', 'graph');
    themeManager.register('--color-graph-select', 'graph');

    themeManager.register('--color-accent', 'general');
    const colorPrimary = themeManager.register('--color-primary', 'general');
    themeManager.register('--color-primary-text', 'general');
    themeManager.register('--color-primary-lite', 'hidden', colorPrimary, ColorTransform.lite);
    themeManager.register('--color-primary-dark', 'hidden', colorPrimary, ColorTransform.dark);

    const colorBackground = themeManager.register('--color-background', 'general');
    themeManager.register('--color-background-active', 'hidden', colorBackground, ColorTransform.invert);
    themeManager.register('--color-background-lite', 'hidden', colorBackground, ColorTransform.lite);

    themeManager.register('--color-success', 'general');
    themeManager.register('--color-warning', 'general');

    const colorSurface = themeManager.register('--color-surface', 'surface');
    themeManager.register('--color-surface-text', 'surface');
    themeManager.register('--color-surface-active', 'hidden', colorSurface, ColorTransform.invert);
    themeManager.register('--color-surface-lite', 'hidden', colorSurface, ColorTransform.lite);
    themeManager.register('--color-surface-dark', 'hidden', colorSurface, ColorTransform.dark);

    const colorSurfaceError = themeManager.register('--color-surface-error', 'surface');
    themeManager.register('--color-surface-error-dark', 'hidden', colorSurfaceError, ColorTransform.dark);

    const colorSurfaceSuccess = themeManager.register('--color-surface-success', 'surface');
    themeManager.register('--color-surface-success-dark', 'hidden', colorSurfaceSuccess, ColorTransform.dark);

    const colorSurfaceWarning = themeManager.register('--color-surface-warning', 'surface');
    themeManager.register('--color-surface-warning-dark', 'hidden', colorSurfaceWarning, ColorTransform.dark);
}

class App extends React.Component
{
    constructor(props)
    {
        super(props);

        App.INSTANCE = this;

        this._toolbarComponent = React.createRef();
        this._drawerComponent = React.createRef();
        this._viewport = null;
        this._labeleditor = null;

        this._themeManager = new ThemeManager();
        this._colorSaver = new ColorSaver(this._themeManager);
        this._langSaver = new LanguageSaver();
        this._saver = new AppSaver(this);

        this._exportManager = new ExportManager();
        this._importManager = new ImportManager();

        this._undoManager = new UndoManager();
        this._hotKeyManager = new HotKeyManager();
        this._drawerManager = new DrawerManager();
        this._menuManager = new MenuManager();
        this._viewportManager = new ViewportManager();
        this._renderManager = new RenderManager();
        this._tooltipManager = new TooltipManager();
        this._notificationManager = new NotificationManager();
        this._broadcastManager = new BroadcastManager(this);

        this._session = new Session()
            .addListener(this._undoManager)
            .addListener(this._hotKeyManager)
            .addListener(this._drawerManager)
            .addListener(this._menuManager)
            .addListener(this._viewportManager)
            .addListener(this._renderManager)
            .addListener(this._tooltipManager)
            .addListener(this._notificationManager)
            .addListener(this._broadcastManager)
            .addListener(this);

        // TODO: This is only used to control transitions (do we really need it?)
        this._init = false;

        this.state = {
            hide: false
        };

        this._mediaQuerySmallWidthList = window.matchMedia('only screen and (max-width: 400px)');
        this._mediaQuerySmallHeightList = window.matchMedia('only screen and (min-height: 400px)');

        // this._notificationManager.pushNotification("Welcome to Flap.js");
        this.onModuleTitleClick = this.onModuleTitleClick.bind(this);
        this.onToolbarClearButton = this.onToolbarClearButton.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        //Start session
        this._session.startSession(this);
    }

    /** @override */
    componentWillUnmount()
    {
        //Stop session
        this._session.stopSession(this);
    }

    /**
     * Called once by index.js when the window is opened, before
     * this constructor or any React components are initialized. This also must be
     * static since React instances are not yet available.
     */
    static onWindowLoad()
    {
        AutoSave.initialize(LocalStorage);
        Broadcast.initialize(BROADCAST_CHANNEL_ID);
    }

    /**
     * Called once by index.js when the window is closed. This is the alternative
     * for clean up since componentWillUnmount() from React will not be called for
     * window events. This also must be static since React instances are no longer
     * available.
     */
    static onWindowUnload()
    {
        AutoSave.destroy();

        if (App.INSTANCE)
        {
            App.INSTANCE.componentWillUnmount();
        }
    }

    //DuckType
    onSessionStart(session)
    {
        const currentModule = session.getCurrentModule();

        // Default values
        this._menuManager
            .addPanelClass(ExportPanel)         // MENU_INDEX_EXPORT
            .addPanelClass(OptionPanel)         // MENU_INDEX_OPTION
            .addPanelClass(LanguagePanel)       // MENU_INDEX_LANGUAGE
            .addPanelClass(ModuleLoaderPanel);  // MENU_INDEX_MODULE

        this._hotKeyManager
            .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => currentModule.clear(this))
            .registerAltHotKey('Show Hints', () => { IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL; });

        // Only register undo / redo hotkeys if undo is possible
        if (this._undoManager.getEventHandlerFactory())
        {
            this._hotKeyManager
                .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => this.getUndoManager().undo())
                .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => this.getUndoManager().redo());
        }

        if (!this._tooltipManager.hasTooltips())
        {
            this._tooltipManager
                .addTooltip('If you need help, try the \'?\' at the top.')
                .addTooltip('Or you can choose to do nothing.')
                .addTooltip('I can\'t do anything about that.')
                .addTooltip('You really should consider doing something though, for the sake of both of us.')
                .addTooltip('Of course, it is your free will.')
                .addTooltip('You do you.')
                .addTooltip('Please do something.')
                .addTooltip('I need my job.')
                .addTooltip('Welcome to Flap.js!');
        }

        this._themeManager.setElement(document.getElementById('root'));

        registerAppStyles(this._themeManager);

        AutoSave.registerHandler(this._saver);
        AutoSave.registerHandler(this._colorSaver);
        AutoSave.registerHandler(this._langSaver);

        this._init = true;
    }

    //DuckType
    onSessionStop(session)
    {
        this._init = false;

        AutoSave.unregisterHandler(this._saver);
        AutoSave.unregisterHandler(this._colorSaver);
        AutoSave.unregisterHandler(this._langSaver);

        this._themeManager.clear();
        this._importManager.clear();
        this._exportManager.clear();
        this._menuManager.setSubtitleComponentClass(null);
    }

    onModuleTitleClick(e)
    {
        const drawer = this._drawerComponent.current;
        if (!drawer.isDrawerOpen() || !drawer.isCurrentTab(DRAWER_INDEX_ABOUT))
        {
            //Open current module info panel
            drawer.setCurrentTab(DRAWER_INDEX_ABOUT);
        }
        else
        {
            //On another click... open module change panel
            const toolbarComponent = this._toolbarComponent.current;
            toolbarComponent.setCurrentMenu(MENU_INDEX_MODULE);
        }

        e.preventDefault();
        e.stopPropagation();
    }

    onToolbarClearButton(e)
    {
        const currentModule = this._session.getCurrentModule();
        if (currentModule)
        {
            currentModule.clear(this);
        }
    }

    getToolbarComponent() { return this._toolbarComponent.current; }
    getDrawerComponent() { return this._drawerComponent.current; }

    getExportManager() { return this._exportManager; }
    getImportManager() { return this._importManager; }

    getUndoManager() { return this._undoManager; }
    getHotKeyManager() { return this._hotKeyManager; }
    getDrawerManager() { return this._drawerManager; }
    getMenuManager() { return this._menuManager; }
    getViewportManager() { return this._viewportManager; }
    getRenderManager() { return this._renderManager; }
    getTooltipManager() { return this._tooltipManager; }
    getNotificationManager() { return this._notificationManager; }
    getThemeManager() { return this._themeManager; }
    getBroadcastManager() { return this._broadcastManager; }

    getSession() { return this._session; }
    getCurrentModule() { return this._session.getCurrentModule(); }

    isExperimental() { return true; }

    /** @override */
    componentDidUpdate()
    {
        this._session.updateSession(this);

        const toolbarComponent = this._toolbarComponent.current;
        const drawerComponent = this._drawerComponent.current;
        //Disable hotkeys when graph is not in view
        this._hotKeyManager.setEnabled(
            !(toolbarComponent && toolbarComponent.isBarOpen()) &&
            !(drawerComponent && drawerComponent.isDrawerOpen() &&
                drawerComponent.isDrawerFullscreen())
        );
    }

    renderRenderLayer(renderLayerName, props)
    {
        const sessionID = this._session.getSessionID();
        const renderers = this._renderManager.getRenderersByLayer(renderLayerName);
        if (renderers && renderers.length > 0)
        {
            return renderers.map((R, i) => <R key={sessionID + '.' + R.constructor.name + '.' + i} {...props} />);
        }
        else
        {
            return null;
        }
    }

    /** @override */
    render()
    {
        const session = this._session;
        const currentModule = session.getCurrentModule();
        const currentModuleLocalizedName = currentModule ? currentModule.getLocalizedModuleName() : null;

        const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
        const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
        const isFullscreen = this.state.hide;

        const exportManager = this._exportManager;
        const importManager = this._importManager;

        const undoManager = this._undoManager;
        const drawerManager = this._drawerManager;
        const menuManager = this._menuManager;
        const tooltipManager = this._tooltipManager;
        const notificationManager = this._notificationManager;

        const toolbarComponent = this._toolbarComponent.current;

        const drawerPanelClasses = drawerManager.getPanelClasses();
        const drawerPanelProps = drawerManager.getPanelProps() || { session: session };
        const menuPanelClasses = menuManager.getPanelClasses();
        const menuPanelProps = menuManager.getPanelProps() || { session: session };
        const MenuSubtitleClass = menuManager.getSubtitleComponentClass();

        return (
            <div className={Style.app_container + (currentModule ? ' active ' : '')}>
                <ToolbarView ref={this._toolbarComponent} className={Style.app_bar}
                    menus={menuPanelClasses}
                    menuProps={menuPanelProps}
                    subtitle={MenuSubtitleClass}
                    hide={isFullscreen}
                    title={currentModuleLocalizedName}
                    session={session}
                    onTitleClick={this.onModuleTitleClick}>
                    <ToolbarButton title={I18N.toString('action.toolbar.newmachine')}
                        icon={PageEmptyIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        onClick={this.onToolbarClearButton}
                        disabled={!currentModule} />
                    <ToolbarUploadButton
                        title={I18N.toString('action.toolbar.uploadmachine')}
                        icon={UploadIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        accept={importManager.getFileTypesAsAcceptString()}
                        onUpload={fileBlob => 
                        {
                            importManager.tryImportFile(fileBlob)
                                .catch(e =>
                                    notificationManager.pushNotification(
                                        'ERROR: Unable to import invalid file.\n' + e.message,
                                        ERROR_LAYOUT_ID,
                                        ERROR_UPLOAD_NOTIFICATION_TAG))
                                .finally(() =>
                                    toolbarComponent.closeBar());
                        }}
                        disabled={importManager.isEmpty()} />
                    <ToolbarButton title={I18N.toString('action.toolbar.undo')}
                        icon={UndoIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        disabled={!undoManager.canUndo()}
                        onClick={() => undoManager.undo()} />
                    <ToolbarButton title={I18N.toString('action.toolbar.redo')}
                        icon={RedoIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        disabled={!undoManager.canRedo()}
                        onClick={() => undoManager.redo()} />
                    <ToolbarButton title={I18N.toString('component.exporting.title')}
                        icon={DownloadIcon}
                        containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_EXPORT)}
                        disabled={exportManager.isEmpty()} />
                    <ToolbarDivider />
                    <ToolbarButton title={I18N.toString('action.toolbar.changemodule')}
                        icon={EditPencilIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_MODULE)} />
                    <ToolbarButton title={I18N.toString('action.toolbar.lang')}
                        icon={WorldIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_LANGUAGE)} />
                    <ToolbarButton title={I18N.toString('component.options.title')}
                        icon={SettingsIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => toolbarComponent.setCurrentMenu(MENU_INDEX_OPTION)} />
                    <ToolbarButton title={I18N.toString('action.toolbar.help')}
                        icon={HelpIcon}
                        onClick={() => window.open(HELP_URL, '_blank')} />
                    <ToolbarButton title={I18N.toString('action.toolbar.bug')}
                        icon={BugIcon}
                        containerOnly={TOOLBAR_CONTAINER_MENU}
                        onClick={() => window.open(BUGREPORT_URL, '_blank')} />
                </ToolbarView>

                <DrawerView ref={this._drawerComponent} className={Style.app_content}
                    panels={drawerPanelClasses}
                    panelProps={drawerPanelProps}
                    side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
                    direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
                    hide={isFullscreen}>

                    <UploadDropZone>
                        <div className="viewport">
                            <TooltipView mode={tooltipManager.getTransitionMode()}
                                visible={/* TODO: For the initial fade-in animation */this._init && !undoManager.canUndo()}>
                                {tooltipManager.getTooltips().map((e, i) => <label key={e + ':' + i}>{e}</label>)}
                            </TooltipView>

                            {/* RENDER_LAYER_WORKSPACE_PRE */}
                            {this.renderRenderLayer(RENDER_LAYER_WORKSPACE_PRE)}

                            {/* RENDER_LAYER_WORKSPACE */}
                            {this.renderRenderLayer(RENDER_LAYER_WORKSPACE)}

                            {/* RENDER_LAYER_WORKSPACE_POST */}
                            {this.renderRenderLayer(RENDER_LAYER_WORKSPACE_POST)}

                            <FullscreenWidget className={Style.fullscreen_widget} app={this} />

                            <NotificationView notificationManager={notificationManager} />

                            {this._hotKeyManager.isEnabled() && <HotKeyView hotKeyManager={this._hotKeyManager} />}
                        </div>
                    </UploadDropZone>
                </DrawerView>
            </div>
        );
    }
}
App.INSTANCE = null;

//For hotloading this class
export default hot(App);
