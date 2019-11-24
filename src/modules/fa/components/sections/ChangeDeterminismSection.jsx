import React from 'react';

import MachineService from '@flapjs/services/MachineService.js';

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
                <MachineService.CONTEXT.StateConsumer>
                    {
                        machineService =>
                        {
                            return (
                                <input id="overviewDeterministic"
                                    type="checkbox"
                                    value={machineService.machineController.getMachine().isDeterministic()}
                                    onChange={e => machineService.machineController.getMachine().setDeterministic(!e.target.value)} />
                            );
                        }
                    }
                </MachineService.CONTEXT.StateConsumer>
                <label htmlFor="overviewDeterministic">
                    Deterministic
                </label>
            </section>
        );
    }
}

export default ChangeDeterminismSection;
