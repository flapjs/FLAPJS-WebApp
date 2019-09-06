Systems
- Icons
  - IconButtons
- Offline Capabilities
- AutoSaver
- I18N
- Theme
  - Color Picker
- LabelEditor
  - Formatted Input
  - Debounced Input
- Notifications
  - NotificationList
  NotificationTemplate
  NotificationEntry
- Toolbar
  Name Field
  New Button
  Undo Button
  Redo Button
  Import Button
  Export Button
  Help Button
- Drawer
  Expandable Drawer
  Multi-Side Drawer
  Tabs
  Panels
  Custom Panel
- Viewport
  UploadDropZone
  Editable View
  Navigable View
  Test View
  Custom View
  Navigation Widgets
    ZoomWidget
    FullscreenWidget
    CenterWidget
  Trash Can
  Action Mode Selector
  SelectionBox
  Graph
    GraphNode
    GraphEdge
    GraphMarker
- HotKeys
- VersionDisplay


First screen should be module/session selection
- background could be the empty workspace (if too big).
- top right is More options and maybe import
- top left is LOGO

Preview Mode (see the result before transform).
Drawer Tabs should not move when expanding.
Back/close button at top left to return to menu
Top right for more options

Definition panel on the left.
Other panels on the right.


```html
<head>
</head>
<body>
    <header></header>
    <article id="workspace">
        <h2>Workspace</h2>
        <article id="notifications">
            <article id="notification">
                <header>
                    <h3>Notification Message</h3>
                </header>
                <section>
                    <h4>Description</h4>
                </section>
                <section>
                    <h4>Actions</h4>
                </section>
                <footer>
                    Credits?
                    related
                </footer>
            </article>
        </article>
    </article>
    <article id="drawer">
        <header>
            <h2>FSA Module</h2>
        </header>
        <article id="definition">
            <header>
                <h2>Definition Panel</h2>
            </header>
            <section>
                <h3>States</h3>
            </section>
            <section>
                <h3>Alphabet</h3>
            </section>
            <aside>
                Extra stuff...
            </aside>
            <footer>
                Credits?
            </footer>
        </article>
        <article id="testing">
            <header>
                <h2>Testing Panel</h2>
            </header>
            <section>
                <h3>Test List</h3>
            </section>
            <section>
                <h3>Test Options</h3>
            </section>
            <aside>
                Extra stuff...
            </aside>
            <footer>
                Credits?
            </footer>
        </article>
    </article>
    <viewport>
    </viewport>
</body>
```
