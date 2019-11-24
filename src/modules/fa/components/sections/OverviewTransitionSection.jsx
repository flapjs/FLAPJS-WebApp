import React from 'react';

import TransitionChartSection from '@flapjs/modules/fa/components/sections/TransitionChartSection.jsx';
import TransitionTableSection from '@flapjs/modules/fa/components/sections/TransitionTableSection.jsx';

class OverviewTransitionSection extends React.Component
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
                <h2>Transitions</h2>
                <section>
                    <TransitionChartSection></TransitionChartSection>
                </section>
                <section>
                    <TransitionTableSection></TransitionTableSection>
                </section>
            </section>
        );
    }
}

export default OverviewTransitionSection;
