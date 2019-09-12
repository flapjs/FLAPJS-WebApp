import LocalStorage from 'util/storage/LocalStorage.js';

import { SEQUENCE_LAYOUT_ID } from 'session/manager/notification/NotificationManager.js';
const TUTORIAL_NOTIFICATION_ID = 'tutorial';

const TUTORIAL_STORAGE_ID = 'prefs-tut_fsa';

class TutorialHandler
{
    constructor() {}

    start(app, forceStart = false)
    {
        if (!forceStart && LocalStorage.getData(TUTORIAL_STORAGE_ID)) return;
        app.getNotificationManager()
            .pushNotification(`-=-= Bab's First Graph =-=-
            We can make a graph by creating nodes and edges.
            
            Nodes
            > DOUBLE CLICK on empty space.

            Edges
            > RIGHT-HOLD on a node, then DRAG out to target.

            If using touchscreen, you can TAP & HOLD instead of a RIGHT-CLICK.`,
            SEQUENCE_LAYOUT_ID, [TUTORIAL_NOTIFICATION_ID], { onClick: () => 
            {
                app.getNotificationManager()
                    .pushNotification(`-=-= More Bab's Graph =-=-
                    You can do so much more.
        
                    Move stuff
                    > CLICK & HOLD on target, then DRAG.
                    
                    Delete stuff
                    > DRAG to Trash Can at bottom-right.
        
                    Edit labels, etc.
                    > RIGHT-CLICK on target.
                    
                    More tools in the Drawer on the right. Check it out!`,
                    SEQUENCE_LAYOUT_ID, [TUTORIAL_NOTIFICATION_ID], { onClick: () =>
                    {
                        // Don't need to show it again.
                        LocalStorage.setData(TUTORIAL_STORAGE_ID, 'true');
                        
                        app.getNotificationManager()
                            .pushNotification(`-=- Bab's Masterpiece -=-
                            Action Mode Tray (Bottom Left)
                            > This will show you whether you are currently editing or moving stuff or you can manually switch them here!
                            
                            Trash Can (Bottom Right)
                            > This will turn RED if deleting stuff. You can also enter Delete Mode with a CLICK.
                            
                            Drawer (Right)
                            > Open the drawer by a CLICK on the tabs. You can toggle fullscreen with the Expand Arrow at the top.
                            
                            Any additional questions, please use the ? button on the toolbar.
                            Have fun!
                            `, null, [TUTORIAL_NOTIFICATION_ID]);
                    }});
            }});
    }
}

export default TutorialHandler;