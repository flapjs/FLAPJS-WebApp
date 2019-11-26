import React from 'react';
import MachineService from '@flapjs/services/MachineService';

class REPlaygroundLayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e, machineService)
    {
        machineService.machineController.getMachine().setExpression(e.target.value);
    }

    /** @override */
    render()
    {
        return (
            <MachineService.CONTEXT.StateConsumer>
                {
                    machineService =>
                    {
                        return (
                            <input
                                type="text"
                                value={machineService.machineController.getMachine().getExpression()}
                                onChange={e => this.onChange(e, machineService)}/>
                        );
                    }
                }
            </MachineService.CONTEXT.StateConsumer>
        );
    }
}

export default REPlaygroundLayer;
