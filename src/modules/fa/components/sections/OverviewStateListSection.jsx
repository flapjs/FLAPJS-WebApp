import React from 'react';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class OverviewStateListSection extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <section>
                <h2>States</h2>
                <SessionStateConsumer>
                    {
                        session =>
                        {
                            return session.graphController.getGraph().getNodes().map(e => (
                                <label key={e.getGraphElementID()}>
                                    {e.getNodeLabel()}
                                </label>
                            ));
                        }
                    }
                </SessionStateConsumer>
            </section>
        );
    }
}

export default OverviewStateListSection;
