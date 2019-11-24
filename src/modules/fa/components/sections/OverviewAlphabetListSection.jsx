import React from 'react';

import MachineService from '@flapjs/services/MachineService.js';

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
                <MachineService.CONTEXT.StateConsumer>
                    {
                        machineService =>
                        {
                            return Array.from(machineService.machineController.getMachine().getAlphabet()).map(e => (
                                <label key={e}>
                                    {e}
                                </label>
                            ));
                        }
                    }
                </MachineService.CONTEXT.StateConsumer>
            </section>
        );
    }
}

export default OverviewAlphabetListSection;
