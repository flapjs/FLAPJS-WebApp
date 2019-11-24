import React from 'react';

import GraphService from '@flapjs/services/GraphService.js';

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
                <GraphService.CONTEXT.StateConsumer>
                    {
                        graphService =>
                        {
                            return graphService.graphController.getGraph().getNodes().map(e => (
                                <label key={e.getGraphElementID()}>
                                    {e.getNodeLabel()}
                                </label>
                            ));
                        }
                    }
                </GraphService.CONTEXT.StateConsumer>
            </section>
        );
    }
}

export default OverviewStateListSection;
