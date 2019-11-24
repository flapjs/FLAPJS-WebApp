import React from 'react';

import GraphService from '@flapjs/services/GraphService.js';

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
            <GraphService.CONTEXT.StateConsumer>
                {
                    graphService =>
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
                                <button onClick={() => this.onApplyLayout(graphService.graphController)}>
                                    Apply
                                </button>
                            </fieldset>
                        );
                    }
                }
            </GraphService.CONTEXT.StateConsumer>
        );
    }
}

export default ApplyGraphLayoutSection;
