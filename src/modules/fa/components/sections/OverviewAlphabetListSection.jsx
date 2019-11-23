import React from 'react';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class OverviewAlphabetListSection extends React.Component
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
                <h2>Alphabet</h2>
                <SessionStateConsumer>
                    {
                        session =>
                        {
                            return Array.from(session.machineController.getMachine().getAlphabet()).map(e => (
                                <label key={e}>
                                    {e}
                                </label>
                            ));
                        }
                    }
                </SessionStateConsumer>
            </section>
        );
    }
}

export default OverviewAlphabetListSection;
