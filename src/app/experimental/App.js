import React from 'react';
import { hot } from 'react-hot-loader/root';
import Style from './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from 'experimental/drawer/DrawerView.js';
import ToolbarView from 'experimental/toolbar/ToolbarView.js';
import ViewportView from 'experimental/viewport/ViewportView.js';
import TooltipView, { ONESHOT_MODE } from 'experimental/tooltip/TooltipView.js';
import UploadDropZone from 'experimental/components/UploadDropZone.js';
import ViewportComponent from 'util/input/components/ViewportComponent.js';
import IconButton from 'experimental/components/IconButton.js';

import ExportPanel from 'experimental/menus/export/ExportPanel.js';
import OptionPanel from 'experimental/menus/option/OptionPanel.js';
import LanguagePanel from 'experimental/menus/language/LanguagePanel.js';
import ModuleLoaderPanel from 'experimental/menus/moduleloader/ModuleLoaderPanel.js';

import ToolbarButton, {TOOLBAR_CONTAINER_TOOLBAR, TOOLBAR_CONTAINER_MENU} from 'experimental/toolbar/ToolbarButton.js';
import ToolbarDivider from 'experimental/toolbar/ToolbarDivider.js';
import ToolbarUploadButton from 'experimental/toolbar/ToolbarUploadButton.js';
import PageEmptyIcon from 'experimental/iconset/PageEmptyIcon.js';
import UndoIcon from 'experimental/iconset/UndoIcon.js';
import RedoIcon from 'experimental/iconset/RedoIcon.js';
import UploadIcon from 'experimental/iconset/UploadIcon.js';
import DownloadIcon from 'experimental/iconset/DownloadIcon.js';
import BugIcon from 'experimental/iconset/BugIcon.js';
import WorldIcon from 'experimental/iconset/WorldIcon.js';
import HelpIcon from 'experimental/iconset/HelpIcon.js';
import SettingsIcon from 'experimental/iconset/SettingsIcon.js';
import EditPencilIcon from 'experimental/iconset/EditPencilIcon.js';

import AppSaver from 'experimental/AppSaver.js';
import ColorSaver from 'experimental/ColorSaver.js';

import AutoSave from 'util/storage/AutoSave.js';
import LocalStorage from 'util/storage/LocalStorage.js';

import NotificationView from 'experimental/notification/NotificationView.js';
import Notifications from 'deprecated/system/notification/Notifications.js';

import StyleOptionRegistry from 'deprecated/system/styleopt/StyleOptionRegistry.js';

import Session from 'session/Session.js';
import ExportManager from 'session/manager/export/ExportManager.js';
import DrawerManager from 'session/manager/DrawerManager.js';
import MenuManager from 'session/manager/MenuManager.js';
import ViewportManager from 'session/manager/ViewportManager.js';
import HotKeyManager from 'session/manager/hotkey/HotKeyManager.js';
import HotKeyView from 'session/manager/hotkey/HotKeyView.js';
import UndoManager from 'session/manager/undo/UndoManager.js';
import RenderManager, {RENDER_LAYER_WORKSPACE, RENDER_LAYER_WORKSPACE_OVERLAY,
  RENDER_LAYER_VIEWPORT, RENDER_LAYER_VIEWPORT_OVERLAY} from 'session/manager/RenderManager.js';
import TooltipManager from 'session/manager/TooltipManager.js';

const BUGREPORT_URL = "https://goo.gl/forms/XSil43Xl5xLHsa0E2";
const HELP_URL = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md";

const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

const DRAWER_INDEX_ABOUT = 0;

const MENU_INDEX_EXPORT = 0;
const MENU_INDEX_OPTION = 1;
const MENU_INDEX_LANGUAGE = 2;
const MENU_INDEX_MODULE = 3;

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this._workspace = React.createRef();
    this._toolbar = null;
    this._drawer = null;
    this._viewport = null;
    this._labeleditor = null;

    this._styleOpts = new StyleOptionRegistry();
    this._colorSaver = new ColorSaver(this._styleOpts);

    this._saver = new AppSaver(this);

    this._undoManager = new UndoManager();
    this._hotKeyManager = new HotKeyManager();
    this._exportManager = new ExportManager(this);
    this._drawerManager = new DrawerManager();
    this._menuManager = new MenuManager();
    this._viewportManager = new ViewportManager();
    this._renderManager = new RenderManager();
    this._tooltipManager = new TooltipManager();

    this._session = new Session()
      .addListener(this._undoManager)
      .addListener(this._hotKeyManager)
      .addListener(this._exportManager)
      .addListener(this._drawerManager)
      .addListener(this._menuManager)
      .addListener(this._viewportManager)
      .addListener(this._renderManager)
      .addListener(this._tooltipManager)
      .addListener(this);

    //TODO: This is only used to control transitions (do we really need it?)
    this._init = false;

    this.state = {
      hide: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");

    //Notifications.addMessage("Welcome to Flap.js");
    this.onModuleTitleClick = this.onModuleTitleClick.bind(this);
    this.onToolbarClearButton = this.onToolbarClearButton.bind(this);
  }

  //Override
  componentDidMount()
  {
    AutoSave.initialize(LocalStorage);
    //Start session
    this._session.startSession(this);
  }

  //Override
  componentWillUnmount()
  {
    this._session.stopSession(this);
    AutoSave.destroy();
  }

  onSessionStart(session)
  {
    //Default values
    this._menuManager
      .addPanelClass(ExportPanel)//MENU_INDEX_EXPORT
      .addPanelClass(OptionPanel)//MENU_INDEX_OPTION
      .addPanelClass(LanguagePanel)//MENU_INDEX_LANGUAGE
      .addPanelClass(ModuleLoaderPanel);//MENU_INDEX_MODULE
    this._hotKeyManager
      .registerAltHotKey("Show Hints", () => {IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL});

    this._colorSaver.initialize();

    AutoSave.registerHandler(this._saver);
    AutoSave.registerHandler(this._colorSaver);

    this._init = true;
  }

  onSessionStop(session)
  {
    this._init = false;

    Notifications.clearMessages();

    AutoSave.unregisterHandler(this._saver);
    AutoSave.unregisterHandler(this._colorSaver);

    this._colorSaver.destroy();
  }

  onModuleTitleClick(e)
  {
    const drawer = this._drawer;
    if (!drawer.isDrawerOpen() || !drawer.isCurrentTab(DRAWER_INDEX_ABOUT))
    {
      //Open current module info panel
      drawer.setCurrentTab(DRAWER_INDEX_ABOUT);
    }
    else
    {
      //On another click... open module change panel
      const toolbar = this._toolbar;
      toolbar.setCurrentMenu(MENU_INDEX_MODULE);
    }
  }

  onToolbarClearButton(e)
  {
    const currentModule = this._session.getCurrentModule();
    if (currentModule)
    {
      currentModule.clear(this);
    }
  }

  getWorkspaceComponent() { return this._workspace.current; }
  getToolbarComponent() { return this._toolbar; }

  getUndoManager() { return this._undoManager; }
  getHotKeyManager() { return this._hotKeyManager; }
  getExportManager() { return this._exportManager; }
  getDrawerManager() { return this._drawerManager; }
  getMenuManager() { return this._menuManager; }
  getViewportManager() { return this._viewportManager; }
  getRenderManager() { return this._renderManager; }
  getTooltipManager() { return this._tooltipManager; }

  getSession() { return this._session; }
  getCurrentModule() { return this._session.getCurrentModule(); }
  getInputAdapter() { return this.getWorkspaceComponent().getInputAdapter(); }
  getStyleOpts() { return this._styleOpts; }

  isExperimental() { return true; }

  //Override
  componentDidUpdate()
  {
    this._session.updateSession(this);

    //Disable hotkeys when graph is not in view
    this._hotKeyManager.setEnabled(
      !(this._toolbar && this._toolbar.isBarOpen()) &&
      !(this._drawer && this._drawer.isDrawerOpen() &&
        this._drawer.isDrawerFullscreen())
      );
  }

  renderRenderers(renderers, props)
  {
    const session = this._session;
    const sessionID = session.getSessionID();
    if (renderers && renderers.length > 0)
    {
      return renderers.map((R, i) => <R key={sessionID + "." + R.constructor.name + "." + i} {...props}/>);
    }
    else
    {
      return null;
    }
  }

  //Override
  render()
  {
    const session = this._session;
    const sessionID = session.getSessionID();
    const currentModule = session.getCurrentModule();
    const currentModuleLocalizedName = currentModule ? currentModule.getLocalizedModuleName() : null;

    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    const isFullscreen = this.state.hide;

    const undoManager = this._undoManager;
    const exportManager = this._exportManager;
    const drawerManager = this._drawerManager;
    const menuManager = this._menuManager;
    const viewportManager = this._viewportManager;
    const renderManager = this._renderManager;
    const tooltipManager = this._tooltipManager;

    const drawerPanelClasses = drawerManager.getPanelClasses();
    const drawerPanelProps = drawerManager.getPanelProps() || {session: session};
    const menuPanelClasses = menuManager.getPanelClasses();
    const menuPanelProps = menuManager.getPanelProps() || {session: session};
    const viewportViewClasses = viewportManager.getViewClasses();
    const viewportViewProps = viewportManager.getViewProps() || {session: session};
    const defaultExporter = exportManager.getDefaultExporter();

    const workspaceRenderers = renderManager.getRenderersByLayer(RENDER_LAYER_WORKSPACE);
    const workspaceOverlayRenderers = renderManager.getRenderersByLayer(RENDER_LAYER_WORKSPACE_OVERLAY);
    const viewportRenderers = renderManager.getRenderersByLayer(RENDER_LAYER_VIEWPORT);
    const viewportOverlayRenderers = renderManager.getRenderersByLayer(RENDER_LAYER_VIEWPORT_OVERLAY);

    return (
      <div className={Style.app_container + (currentModule ? " active " : "")}>
        <ToolbarView ref={ref=>this._toolbar=ref} className={Style.app_bar}
          menus={menuPanelClasses}
          menuProps={menuPanelProps}
          hide={isFullscreen}
          title={currentModuleLocalizedName}
          session={session}
          onTitleClick={this.onModuleTitleClick}>
          <ToolbarButton title={I18N.toString("action.toolbar.newmachine")} icon={PageEmptyIcon}
            onClick={this.onToolbarClearButton}
            disabled={!currentModule}/>
          <ToolbarUploadButton title={I18N.toString("action.toolbar.uploadmachine")} icon={UploadIcon} accept={exportManager.getImportFileTypes().join(",")}
            onUpload={fileBlob => {
              exportManager.tryImportFromFile(fileBlob)
                .catch((e) => {
                  Notifications.addErrorMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");
                  console.error(e);
                })
                .finally(() => {
                  this._toolbar.closeBar();
                });
            }}
            disabled={!defaultExporter || !defaultExporter.canImport(currentModule)}/>
          <ToolbarButton title={I18N.toString("action.toolbar.undo")} icon={UndoIcon} containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
            disabled={!undoManager.canUndo()}
            onClick={()=>undoManager.undo()}/>
          <ToolbarButton title={I18N.toString("action.toolbar.redo")} icon={RedoIcon} containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
            disabled={!undoManager.canRedo()}
            onClick={()=>undoManager.redo()}/>
          <ToolbarButton title={I18N.toString("component.exporting.title")} icon={DownloadIcon}
            onClick={()=>this._toolbar.setCurrentMenu(MENU_INDEX_EXPORT)}
            disabled={!defaultExporter || !defaultExporter.canExport(currentModule)}/>
          <ToolbarDivider/>
          <ToolbarButton title={I18N.toString("action.toolbar.bug")} icon={BugIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>window.open(BUGREPORT_URL, '_blank')}/>
          <ToolbarButton title={I18N.toString("action.toolbar.lang")} icon={WorldIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>this._toolbar.setCurrentMenu(MENU_INDEX_LANGUAGE)}/>
          <ToolbarButton title={I18N.toString("action.toolbar.help")} icon={HelpIcon}
            onClick={()=>window.open(HELP_URL, '_blank')}/>
          <ToolbarButton title={I18N.toString("component.options.title")} icon={SettingsIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>this._toolbar.setCurrentMenu(MENU_INDEX_OPTION)}/>
          <ToolbarButton title={"Change Module"} icon={EditPencilIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>this._toolbar.setCurrentMenu(MENU_INDEX_MODULE)}/>
        </ToolbarView>

        <DrawerView ref={ref=>this._drawer=ref} className={Style.app_content}
          panels={drawerPanelClasses}
          panelProps={drawerPanelProps}
          side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
          direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
          hide={isFullscreen}>

          <UploadDropZone>
            <div className="viewport">

              <TooltipView mode={tooltipManager.getTransitionMode()}
                visible={/* TODO: For the initial fade-in animation */this._init && !undoManager.canUndo()}>
                {tooltipManager.getTooltips().map((e, i) => <label key={e + ":" + i}>{e}</label>)}
              </TooltipView>

              <ViewportComponent ref={this._workspace}>
                {/* RENDER_LAYER_WORKSPACE */}
                {this.renderRenderers(workspaceRenderers, {workspace: this.getWorkspaceComponent()})}
              </ViewportComponent>

              {/* RENDER_LAYER_WORKSPACE_OVERLAY */}
              {this.renderRenderers(workspaceOverlayRenderers, {workspace: this.getWorkspaceComponent()})}

              <NotificationView notificationManager={Notifications}>
              </NotificationView>

              {this._hotKeyManager.isEnabled() &&
                <HotKeyView hotKeyManager={this._hotKeyManager}/>}

              <ViewportView ref={ref=>this._viewport=ref}
                views={viewportViewClasses}
                viewProps={viewportViewProps}>
                {/* RENDER_LAYER_VIEWPORT */}
                {this.renderRenderers(viewportRenderers, {viewport: this._viewport})}
              </ViewportView>

              {/* RENDER_LAYER_VIEWPORT_OVERLAY */}
              {this.renderRenderers(viewportOverlayRenderers, {viewport: this._viewport})}

            </div>
          </UploadDropZone>
        </DrawerView>
      </div>
    );
  }
}

//For hotloading this class
export default hot(App);
