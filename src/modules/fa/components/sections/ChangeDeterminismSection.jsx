import React from 'react';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class ChangeDeterminismSection extends React.Component
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
                <SessionStateConsumer>
                    {
                        session =>
                        {
                            return (
                                <input id="overviewDeterministic"
                                    type="checkbox"
                                    value={session.machineController.getMachine().isDeterministic()}
                                    onChange={e => session.machineController.getMachine().setDeterministic(!e.target.value)} />
                            );
                        }
                    }
                </SessionStateConsumer>
                <label htmlFor="overviewDeterministic">
                    Deterministic
                </label>
            </section>
        );
    }
}

export default ChangeDeterminismSection;
