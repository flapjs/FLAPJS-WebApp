import React from 'react';
import { hot } from 'react-hot-loader/root';
import './App.css';

import DrawerView, { DRAWER_SIDE_RIGHT, DRAWER_SIDE_BOTTOM, DRAWER_BAR_DIRECTION_VERTICAL, DRAWER_BAR_DIRECTION_HORIZONTAL } from 'experimental/drawer/DrawerView.js';
import ToolbarView from 'experimental/toolbar/ToolbarView.js';
import WorkspaceView from 'experimental/workspace/WorkspaceView.js';
import ViewportView from 'experimental/viewport/ViewportView.js';
import TooltipView, { ONESHOT_MODE } from 'experimental/tooltip/TooltipView.js';
import UploadDropZone from 'experimental/components/UploadDropZone.js';

import ExportPanel from 'experimental/menus/export/ExportPanel.js';
import OptionPanel from 'experimental/menus/option/OptionPanel.js';
import LanguagePanel from 'experimental/menus/language/LanguagePanel.js';

import EditPane from 'experimental/EditPane.js';
import TapePane from 'experimental/TapePane.js';

import OverviewPanel from 'experimental/panels/overview/OverviewPanel.js';
import AnalysisPanel from 'experimental/panels/analysis/AnalysisPanel.js';
import TestingPanel from 'experimental/panels/test/TestingPanel.js';

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

import IconButton from 'experimental/components/IconButton.js';
import HotKeyManager, {CTRL_KEY, ALT_KEY, SHIFT_KEY} from 'experimental/hotkey/HotKeyManager.js';
import HotKeyView from 'experimental/hotkey/HotKeyView.js';

import Notifications from 'system/notification/Notifications.js';
import NotificationView from 'system/notification/components/NotificationView.js';

import InputAdapter from 'system/inputadapter/InputAdapter.js';
import UndoManager from 'system/undomanager/UndoManager.js';
import LocalSave from 'system/localsave/LocalSave.js';

import DefaultModule from 'modules/default/DefaultModule.js';
import Module from 'modules/fsa/FSAModule.js';

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

    //These need to be initialized before module
    this._inputAdapter = new InputAdapter();
    this._inputAdapter.getViewport()
      .setMinScale(MIN_SCALE)
      .setMaxScale(MAX_SCALE)
      .setOffsetDamping(SMOOTH_OFFSET_DAMPING);
    this._undoManager = new UndoManager();

    this._hotKeyManager = new HotKeyManager();
    this._hotKeyManager.registerHotKey("Export to PNG", [CTRL_KEY, 'KeyP'], () => {console.log("Export!")});
    this._hotKeyManager.registerHotKey("Save as JSON", [CTRL_KEY, 'KeyS'], () => {console.log("Save!")});
    this._hotKeyManager.registerHotKey("New", [CTRL_KEY, 'KeyN'], () => {console.log("New!")});
    this._hotKeyManager.registerHotKey("Undo", [CTRL_KEY, 'KeyZ'], () => {console.log("Undo!")});
    this._hotKeyManager.registerHotKey("Redo", [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => {console.log("Redo!")});
    this._hotKeyManager.registerAltHotKey("Show Hints", () => { IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL })

    this._saver = new AppSaver(this);

    //TODO: This is only used to control transitions (do we really need it?)
    this._init = false;

    this.state = {
      module: new Module(this),
      hide: false
    };

    this._mediaQuerySmallWidthList = window.matchMedia("only screen and (max-width: 400px)");
    this._mediaQuerySmallHeightList = window.matchMedia("only screen and (min-height: 400px)");

    //Notifications.addMessage("Welcome to Flap.js");
  }

  //Override
  componentDidMount()
  {
    const workspaceDOM = this._workspace.ref;
    this._inputAdapter.initialize(workspaceDOM);

    const currentModule = this.getCurrentModule();
    currentModule.initialize(this);

    this._hotKeyManager.initialize();

    LocalSave.registerHandler(this._saver);

    this._init = true;
  }

  //Override
  componentWillUnmount()
  {
    this._init = false;

    LocalSave.unregisterHandler(this._saver);

    this._hotKeyManager.destroy();

    const currentModule = this.getCurrentModule();
    currentModule.destroy(this);

    this._inputAdapter.destroy();
  }

  get workspace() { return this._workspace; }
  get viewport() { return this._inputAdapter.getViewport(); }

  setCurrentModuleClass(ModuleClass)
  {
    const prevModule = this.getCurrentModule();
    prevModule.destroy(this);

    const currentModule = new ModuleClass(this);
    this.setState({ module: currentModule }, () => {
      currentModule.initialize(this);
    });
  }

  getCurrentModule() { return this.state.module; }
  getInputAdapter() { return this._inputAdapter; }
  getUndoManager() { return this._undoManager; }
  getHotKeyManager() { return this._hotKeyManager; }

  //Override
  componentDidUpdate()
  {
    const currentModule = this.state.module;
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
    const currentModule = this.state.module;
    const inputAdapter = this._inputAdapter;

    const hasSmallWidth = this._mediaQuerySmallWidthList.matches;
    const hasSmallHeight = this._mediaQuerySmallHeightList.matches;
    const isFullscreen = this.state.hide;

    const undoManager = this._undoManager;
    const viewport = inputAdapter.getViewport();
    const inputController = currentModule.getInputController();
    const graphController = currentModule.getGraphController();
    const machineController = currentModule.getMachineController();
    const graphImporter = graphController.getGraphImporter();
    const inputActionMode = inputController.isActionMode();

    const moduleName = currentModule.getLocalizedModuleName();
    const modulePanels = [TestingPanel, OverviewPanel, AnalysisPanel];
    const modulePanelProps = {currentModule: currentModule, app: this};
    const moduleMenus = currentModule.getModuleMenus().concat([ExportPanel, OptionPanel, LanguagePanel]);
    const moduleMenuProps = {currentModule: currentModule, app: this};
    const moduleViews = currentModule.getModuleViews().concat([EditPane, TapePane]);
    const moduleViewProps = {currentModule: currentModule, app: this};

    const GRAPH_RENDER_LAYER = "graph";
    const GRAPH_OVERLAY_RENDER_LAYER = "graphoverlay";
    const VIEWPORT_RENDER_LAYER = "viewport";
    const GraphRenderer = currentModule.getRenderer(GRAPH_RENDER_LAYER);
    const GraphOverlayRenderer = currentModule.getRenderer(GRAPH_OVERLAY_RENDER_LAYER);
    const ViewportRenderer = currentModule.getRenderer(VIEWPORT_RENDER_LAYER);

    return (
      <div className="app-container">

        <ToolbarView ref={ref=>this._toolbar=ref} className="app-bar"
          menus={moduleMenus}
          menuProps={moduleMenuProps}
          hide={isFullscreen}
          title={moduleName}>
          <ToolbarButton title="New" icon={PageEmptyIcon}
            onClick={() => UserUtil.userClearGraph(this, false, () => this._toolbar.closeBar())}/>
          <ToolbarUploadButton title="Upload" icon={UploadIcon} accept={graphImporter.getImportFileTypes().join(",")}
            onUpload={file => {
              graphImporter.importFile(file, currentModule)
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

        <DrawerView ref={ref=>this._drawer=ref} className="app-content"
          panels={modulePanels}
          panelProps={modulePanelProps}
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

              <NotificationView notificationManager={Notifications}>
              </NotificationView>

              <HotKeyView hotKeyManager={this._hotKeyManager}/>

              <ViewportView ref={ref=>this._viewport=ref}
                views={moduleViews}
                viewProps={moduleViewProps}>
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
