import React from 'react';

import ExportPanel from '@flapjs/modules/base/ExportPanel.jsx';
import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

export function renderAppBar()
{
    return (
        <SessionStateConsumer>
            {
                session => (
                    <>
                    <button onClick={() => session.undoManager.undo()}>Undo</button>
                    <button onClick={() => session.undoManager.redo()}>Redo</button>
                    <input type="file" name="import" onChange={e =>
                    {
                        const files = e.target.files;
                        if (files.length > 0)
                        {
                            session.importManager.tryImportFile(files[0], session);
                
                            //Makes sure you can upload the same file again.
                            e.target.value = '';
                        }
                    }}/>
                    </>
                )
            }
        </SessionStateConsumer>
    );
}

export function renderDrawer()
{
    return (
        <ExportPanel />
    );
}

export function renderViewport()
{
    return (
        null
    );
}
