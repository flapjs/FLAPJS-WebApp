import React from 'react';

import { SessionStateConsumer } from '@flapjs/session/context/SessionContext.jsx';

class ApplyGraphLayoutSection extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            layoutType: ''
        };

        this.onApplyLayout = this.onApplyLayout.bind(this);
    }

    onApplyLayout(graphController)
    {
        graphController.applyAutoLayout();
    }

    /** @override */
    render()
    {
        const state = this.state;

        return (
            <SessionStateConsumer>
                {
                    session =>
                    {
                        return (
                            <fieldset>
                                <legend>Apply layout to graph</legend>
                                <p>
                                    <select value={state.layoutType} disabled={true}>
                                        <option>Circular</option>
                                        <option>Tree</option>
                                    </select>
                                </p>
                                <button onClick={() => this.onApplyLayout(session.graphController)}>
                                    Apply
                                </button>
                            </fieldset>
                        );
                    }
                }
            </SessionStateConsumer>
        );
    }
}

export default ApplyGraphLayoutSection;
