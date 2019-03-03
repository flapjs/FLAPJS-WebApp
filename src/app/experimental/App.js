import React from 'react';
import { hot } from 'react-hot-loader/root';
import Style from './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from 'experimental/drawer/DrawerView.js';
import ToolbarView from 'experimental/toolbar/ToolbarView.js';
import WorkspaceView from 'experimental/workspace/WorkspaceView.js';
import ViewportView from 'experimental/viewport/ViewportView.js';
import TooltipView, { ONESHOT_MODE } from 'experimental/tooltip/TooltipView.js';
import UploadDropZone from 'experimental/components/UploadDropZone.js';
import LabelEditorView from 'experimental/editor/LabelEditorView.js';

import ExportPanel from 'experimental/menus/export/ExportPanel.js';
import OptionPanel from 'experimental/menus/option/OptionPanel.js';
import LanguagePanel from 'experimental/menus/language/LanguagePanel.js';
import EditPane from 'experimental/EditPane.js';

import ToolbarButton, {TOOLBAR_CONTAINER_TOOLBAR, TOOLBAR_CONTAINER_MENU } from 'experimental/toolbar/ToolbarButton.js';
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

import * as UserUtil from 'experimental/UserUtil.js';
import AppSaver from 'experimental/AppSaver.js';
import ColorSaver from 'experimental/ColorSaver.js';

import IconButton from 'experimental/components/IconButton.js';

import NotificationView from 'experimental/notification/NotificationView.js';
import Notifications from 'system/notification/Notifications.js';

import InputAdapter from 'system/inputadapter/InputAdapter.js';
import LocalSave from 'system/localsave/LocalSave.js';
import StyleOptionRegistry from 'system/styleopt/StyleOptionRegistry.js';

import Session from 'session/Session.js';
import ExportManager from 'manager/ExportManager.js';
import DrawerManager from 'manager/DrawerManager.js';
import MenuManager from 'manager/MenuManager.js';
import ViewportManager from 'manager/ViewportManager.js';
import HotKeyManager from 'manager/hotkey/HotKeyManager.js';
import HotKeyView from 'manager/hotkey/HotKeyView.js';
import UndoManager from 'manager/undo/UndoManager.js';
import RenderManager, {RENDER_LAYER_WORKSPACE, RENDER_LAYER_WORKSPACE_OVERLAY, RENDER_LAYER_LABELEDITOR} from 'manager/RenderManager.js';

import Module from 'modules/fsa2/FSAModule.js';

const BUGREPORT_URL = "https://goo.gl/forms/XSil43Xl5xLHsa0E2";
const HELP_URL = "https://github.com/flapjs/FLAPJS-WebApp/blob/master/docs/HELP.md";

const SMOOTH_OFFSET_DAMPING = 0.4;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this._workspace = null;
    this._toolbar = null;
    this._drawer = null;
    this._viewport = null;
    this._labeleditor = null;

    //These need to be initialized before module
    this._inputAdapter = new InputAdapter();
    this._inputAdapter.getViewport()
      .setMinScale(MIN_SCALE)
      .setMaxScale(MAX_SCALE)
      .setOffsetDamping(SMOOTH_OFFSET_DAMPING);

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

    this._session = new Session(this, props.moduleClass || Module)
      .addListener(this._undoManager)
      .addListener(this._hotKeyManager)
      .addListener(this._exportManager)
      .addListener(this._drawerManager)
      .addListener(this._menuManager)
      .addListener(this._viewportManager)
      .addListener(this._renderManager);

    //TODO: This is only used to control transitions (do we really need it?)
    this._init = false;

    this.state = {
      hide: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");

    //Notifications.addMessage("Welcome to Flap.js");
    this.onModuleTitleClick = this.onModuleTitleClick.bind(this);
  }

  //Override
  componentDidMount()
  {
    const workspaceDOM = this._workspace.ref;
    this._inputAdapter.initialize(workspaceDOM);

    //Default values
    this._menuManager
      .addPanelClass(ExportPanel)
      .addPanelClass(OptionPanel)
      .addPanelClass(LanguagePanel);
    this._viewportManager
      .addViewClass(EditPane);
    this._hotKeyManager
      .registerAltHotKey("Show Hints", () => {IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL});

    //Start session
    this._session.start(this.props.moduleClass || Module);

    this._colorSaver.initialize();

    LocalSave.registerHandler(this._saver);
    LocalSave.registerHandler(this._colorSaver);

    this._init = true;
  }

  //Override
  componentWillUnmount()
  {
    this._init = false;

    Notifications.clearMessages();

    LocalSave.unregisterHandler(this._saver);
    LocalSave.unregisterHandler(this._colorSaver);

    this._colorSaver.destroy();

    this._session.stop();

    this._inputAdapter.destroy();
  }

  onModuleTitleClick(e)
  {
    this._drawer.setCurrentTab(0);
  }

  get workspace() { return this._workspace; }
  get viewport() { return this._inputAdapter.getViewport(); }

  getWorkspaceComponent() { return this._workspace; }
  getLabelEditorComponent() { return this._labeleditor; }

  getUndoManager() { return this._undoManager; }
  getHotKeyManager() { return this._hotKeyManager; }
  getExportManager() { return this._exportManager; }
  getDrawerManager() { return this._drawerManager; }
  getMenuManager() { return this._menuManager; }
  getViewportManager() { return this._viewportManager; }
  getRenderManager() { return this._renderManager; }

  getSession() { return this._session; }

  getCurrentModule() { return this._session.getCurrentModule(); }

  getInputAdapter() { return this._inputAdapter; }
  getStyleOpts() { return this._styleOpts; }

  //Override
  componentDidUpdate()
  {
    const currentModule = this._session.getCurrentModule();
    const inputAdapter = this._inputAdapter;

    inputAdapter.update();
    currentModule.update(this);

    //Disable hotkeys when graph is not in view
    this._hotKeyManager.setEnabled(
      !(this._toolbar && this._toolbar.isBarOpen()) &&
      !(this._drawer && this._drawer.isDrawerOpen() &&
        this._drawer.isDrawerFullscreen())
      );
  }

  //Override
  render()
  {
    const currentModule = this._session.getCurrentModule();
    const inputAdapter = this._inputAdapter;

    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    const isFullscreen = this.state.hide;

    const session = this._session;
    const undoManager = this._undoManager;
    const viewport = inputAdapter.getViewport();
    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const graphLabeler = graphController.getGraphLabeler();
    const inputActionMode = inputController.isActionMode();

    const exportManager = this._exportManager;
    const drawerManager = this._drawerManager;
    const menuManager = this._menuManager;
    const viewportManager = this._viewportManager;
    const renderManager = this._renderManager;

    const drawerPanelClasses = drawerManager.getPanelClasses();
    const drawerPanelProps = drawerManager.getPanelProps() || {session: session};

    const menuPanelClasses = menuManager.getPanelClasses();
    const menuPanelProps = menuManager.getPanelProps() || {session: session};

    const viewportViewClasses = viewportManager.getViewClasses();
    const viewportViewProps = viewportManager.getViewProps() || {session: session};

    const moduleName = currentModule.getLocalizedModuleName();

    const GraphRenderer = renderManager.getRendererByLayer(RENDER_LAYER_WORKSPACE);
    const GraphOverlayRenderer = renderManager.getRendererByLayer(RENDER_LAYER_WORKSPACE_OVERLAY);
    const LabelEditorRenderer = renderManager.getRendererByLayer(RENDER_LAYER_LABELEDITOR);

    return (
      <div className={Style.app_container}>

        <ToolbarView ref={ref=>this._toolbar=ref} className={Style.app_bar}
          menus={menuPanelClasses}
          menuProps={menuPanelProps}
          hide={isFullscreen}
          title={moduleName}
          session={session}
          onTitleClick={this.onModuleTitleClick}>
          <ToolbarButton title="New" icon={PageEmptyIcon}
            onClick={() => UserUtil.userClearGraph(this, false, () => this._toolbar.closeBar())}/>
          <ToolbarUploadButton title="Upload" icon={UploadIcon} accept={exportManager.getImportFileTypes().join(",")}
            onUpload={fileBlob => {
              exportManager.tryImportFromFile(fileBlob)
                .catch((e) => {
                  Notifications.addErrorMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");
                  console.error(e);
                })
                .finally(() => {
                  this._toolbar.closeBar();
                });
            }}/>
          <ToolbarButton title="Undo" icon={UndoIcon} containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
            disabled={!undoManager.canUndo()}
            onClick={()=>undoManager.undo()}/>
          <ToolbarButton title="Redo" icon={RedoIcon} containerOnly={TOOLBAR_CONTAINER_TOOLBAR}
            disabled={!undoManager.canRedo()}
            onClick={()=>undoManager.redo()}/>
          <ToolbarButton title={I18N.toString("component.exporting.title")} icon={DownloadIcon}
            onClick={()=>this._toolbar.setCurrentMenu(0)}
            disabled={graphController.getGraph().isEmpty()}/>
          <ToolbarDivider/>
          <ToolbarButton title="Report a Bug" icon={BugIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>window.open(BUGREPORT_URL, '_blank')}/>
          <ToolbarButton title="Language" icon={WorldIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>this._toolbar.setCurrentMenu(2)}/>
          <ToolbarButton title="Help" icon={HelpIcon}
            onClick={()=>window.open(HELP_URL, '_blank')}/>
          <ToolbarButton title={I18N.toString("component.options.title")} icon={SettingsIcon} containerOnly={TOOLBAR_CONTAINER_MENU}
            onClick={()=>this._toolbar.setCurrentMenu(1)}/>
        </ToolbarView>

        <DrawerView ref={ref=>this._drawer=ref} className={Style.app_content}
          panels={drawerPanelClasses}
          panelProps={drawerPanelProps}
          side={hasSmallWidth ? DRAWER_SIDE_BOTTOM : DRAWER_SIDE_RIGHT}
          direction={hasSmallHeight ? DRAWER_BAR_DIRECTION_VERTICAL : DRAWER_BAR_DIRECTION_HORIZONTAL}
          hide={isFullscreen}>

          <UploadDropZone>
            <div className="viewport">

              <TooltipView mode={ONESHOT_MODE} visible={/* For the initial fade-in animation */this._init && graphController.getGraph().isEmpty()}>
                <label>{I18N.toString("message.workspace.empty")}</label>
                <label>{"If you need help, try the \'?\' at the top."}</label>
                <label>{"Or you can choose to do nothing."}</label>
                <label>{"I can't do anything about that."}</label>
                <label>{"You really should consider doing something though, for the sake of both of us."}</label>
                <label>{"Of course, it is your free will."}</label>
                <label>{"You do you."}</label>
                <label>{"Please do something."}</label>
                <label>{"I need my job."}</label>
                <label>{I18N.toString("message.workspace.empty")}</label>
              </TooltipView>

              <WorkspaceView ref={ref=>this._workspace=ref} viewport={viewport}>
                {/* Graph origin crosshair */
                  !graphController.getGraph().isEmpty() &&
                  <React.Fragment>
                    <line className="graph-ui" x1="0" y1="-5" x2="0" y2="5" stroke="var(--color-viewport-back-detail)"/>
                    <line className="graph-ui" x1="-5" y1="0" x2="5" y2="0" stroke="var(--color-viewport-back-detail)"/>
                  </React.Fragment>}
                {/* Graph objects */
                  GraphRenderer &&
                  <GraphRenderer currentModule={currentModule} parent={this._workspace}/>}
                {/* Graph overlays */
                  GraphOverlayRenderer &&
                  <GraphOverlayRenderer currentModule={currentModule} parent={this._workspace}/>}
              </WorkspaceView>

              <LabelEditorView ref={ref=>this._labeleditor=ref}
                labeler={graphLabeler}
                viewport={viewport}
                saveOnExit={true}>
                {/* LabelEditor objects */
                  LabelEditorRenderer &&
                  <LabelEditorRenderer currentModule={currentModule} parent={this._labeleditor}/>}
              </LabelEditorView>

              <NotificationView notificationManager={Notifications}>
              </NotificationView>

              <HotKeyView hotKeyManager={this._hotKeyManager}/>

              <ViewportView ref={ref=>this._viewport=ref}
                views={viewportViewClasses}
                viewProps={viewportViewProps}>
              </ViewportView>

            </div>
          </UploadDropZone>
        </DrawerView>

      </div>
    );
  }
}

//For hotloading this class
export default hot(App);
