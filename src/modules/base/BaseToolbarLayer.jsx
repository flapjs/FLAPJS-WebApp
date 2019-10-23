import React from 'react';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class BaseToolbarLayer extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <SessionStateConsumer>
                {
                    state => (
                        <>
                        <button onClick={() => state.undoManager.undo()}>Undo</button>
                        <button onClick={() => state.undoManager.redo()}>Redo</button>
                        </>
                    )
                }
            </SessionStateConsumer>
        );
    }
}

export default BaseToolbarLayer;

