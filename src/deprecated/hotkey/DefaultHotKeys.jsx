import { CTRL_KEY } from './HotKeyManager.js';

export function initialize(hotKeyManager)
{
    hotKeyManager
        // eslint-disable-next-line no-console
        .registerHotKey('New', [CTRL_KEY, 'KeyN'], () => console.log('NEW')/*currentModule.clear(this) */)
        .registerAltHotKey('Show Hints', () => { /* IconButton.SHOW_LABEL = !IconButton.SHOW_LABEL; */ });

    /*
    // Only register undo / redo hotkeys if undo is possible
    if (this._undoManager.getEventHandlerFactory())
    {
        this._hotKeyManager
            .registerHotKey('Undo', [CTRL_KEY, 'KeyZ'], () => this.getUndoManager().undo())
            .registerHotKey('Redo', [CTRL_KEY, SHIFT_KEY, 'KeyZ'], () => this.getUndoManager().redo());
    }
    */
}

export function update(hotKeyManager)
{
    /*
    // Update every time.
    //Disable hotkeys when graph is not in view
    hotKeyManager.setEnabled(
        !(toolbarComponent && toolbarComponent.isBarOpen()) &&
        !(drawerComponent && drawerComponent.isDrawerOpen() &&
            drawerComponent.isDrawerFullscreen())
    );
    */
}
