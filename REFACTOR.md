GLOBALS
- I18N
    - fetchLanguageFiles()

= APP
    = COMPONENTS
        - IconButtons
        - IconSet
    = EXPERIMENTAL
        - COMPONENTS
            + Fullscreen
            + IconButton
            + IconStateButton (checkbox?)
            + UploadDropZone
        - DRAWER
            + Expandable drawer
        - MENUS
            + MenuPanel
                + Export
                + Language Selector
                + Module Selector
                + Options (with preview?)
        - PANELS
            + PanelButton
            + PanelCheckbox
            + PanelContainer
            + PanelDivider
            + PanelSection
            + PanelSwitch
        - TOOLBAR
            + ToolbarDivider
            + ToolbarTitle
            + ToolbarButton
            + ToolbarUploadButton
            + ToolbarView
        - TOOLTIP
            // Background tooltips that rotate sequentially, etc.
        + App
        + AppSaver
        + ColorSaver
        + GraphChangeHandler
        + MachineChangeHandler
        + UserUtil (to clear graph with prompts)
    = SESSION
        - MANAGER
            - BROADCAST
                + BroadcastManager
            - HOTKEY
                + HotKeyManager
                + HotKeyView
            - NOTIFICATION
                + NotificationView
                + NotificationLayout
                + Notification
                + NotificaitonManager
            - UNDO
                + UndoManager
                + EventHandler
            + DrawerManager
            + MenuManager
            + RenderManager
            + TooltipManager
            + ViewportManager
        + Session
        + SessionExporter
        + SessionImporter
    = UTIL
        - BROADCAST
            + Broadcast
        - FILE
            + Exporter / Importer / Parser
        - INPUT
            + Dragging things
        - LOGGER
        - STORAGE
            + LocalStorage
            + SessionStorage
            + AutoSaver
        - THEME
            + ThemeManager
        - VERSION
            + SemanticVersion
        + ColorHelper
        + ColorTransform
        + Downloader
        + EVentable
        + MathHelper
        + URLHelper
    = GRAMMAR
    = GRAPH2
    = MODULES
+ Changelog (some way to show updated version for installation)

Session
    - Communication between sessions
Import / Export
    - Arbitrary management of state and data
    - Undo/Redo
Module
    - Management of different modules


Session


Session
Module
Notification
Modal
Theme
Tooltip
Hotkeys

Changelog
Utils
Localization

Graph
Grammar
Machine

Drawer
Menu
Toolbar

Storage
Save/Load/Export
Undo/Redo

Ways to render modules:
- render Workspace method
- named render methods
- render method with SLOTS
- register method
- config method


WTFSS

2 things a day + 1 feature for PA

Components only re-render if setState is called.

Therefore, if a module has a drawer component, and it's state changes.



Session holds state.
- renders things

Module is a singleton and DOES NOT HOLD STATE.
- onChange callback for state changes

App Load (default husk)
// Module Create - Hidden
// Session Create - Hidden
initialize(app, session)
{
    
}

app.registerRender('foreground', workspace => (
    <div>
        <h1>Hello World!</h1>
    </div>
));

app.registerRender('background', workspace => (
    <div>
        <h1>Goodbye World!</h1>
    </div>
));

onSessionStart()
onSessionUpdate()
onSessionStop()
terminate()
// Session Destroy - Hidden
// Module Destroy - Hidden
App Unload


Module

<RenderModule
    renderForeground={() => {
        <ForegroundStuff></ForegroundStuff>
    }}
    renderBackground={() => {

    }}/>

render()
{
    return (
        <Foreground>
            Some Text
        </Foreground>
        <Background>
        </Background>
        <Drawer>
            <DrawerPanel>
                <button onClick={change foreground state}>
            </DrawerPanel>
        </Drawer>
    );
}


https://daveceddia.com/redux-tutorial/
https://www.robinwieruch.de/react-web-components