import React from 'react';

import { isEquivalentFSAWithWitness } from '@flapjs/modules/fa/machine/util/EqualFSA.js';
import { createMachineFromFileBlob } from '@flapjs/modules/fa/machine/FSAMachineLoader.js';
import MachineService from '@flapjs/services/MachineService.js';
import FSA from '@flapjs/modules/fa/machine/FSA.js';

class TestingEquivalenceSection extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            isEqual: null,
            witnessString: '',
        };

        this._machineUploaded = null;

        this.onPerformEquivalenceTest = this.onPerformEquivalenceTest.bind(this);
        this.onTargetFileUpload = this.onTargetFileUpload.bind(this);
    }

    onPerformEquivalenceTest(machineController)
    {
        if (this._machineUploaded instanceof FSA)
        {
            const currentMachine = machineController.getMachine();
            const equivalenceResult = isEquivalentFSAWithWitness(this._machineUploaded, currentMachine);
            if (equivalenceResult.value)
            {
                this.setState({ isEqual: true, witnessString: '' });
            }
            else
            {
                if(!equivalenceResult.witnessString)
                {
                    this.setState({ isEqual: false, witnessString: 'Sorry, the machines have different alphabets' });
                }
                else
                {
                    this.setState({ isEqual: false, witnessString: 'Witness: ' + equivalenceResult.witnessString });
                }
            }
        }
        else if (this._machineUploaded)
        {
            this.setState({ isEqual: null, witnessString: this._machineUploaded });
        }
    }

    onTargetFileUpload(e)
    {
        const files = e.target.files;
        if (files.length > 0)
        {
            createMachineFromFileBlob(files[0])
                .then(result => this._machineUploaded = result)
                .catch(err => this._machineUploaded = err.message);
        }
        else
        {
            this._machineUploaded = null;
        }
    }

    /** @override */
    render()
    {
        return (
            <fieldset>
                <legend>Test equivalence with machine</legend>
                <MachineService.CONTEXT.StateConsumer>
                    {
                        machineService =>
                        {
                            return (
                                <>
                                <div>
                                    <input type="file" name="import"
                                        onChange={this.onTargetFileUpload}/>
                                </div>
                                <button id="testEquivalenceTargetFile" onClick={e => this.onPerformEquivalenceTest(machineService.machineController)}>Test</button>
                                </>
                            );
                        }
                    }
                </MachineService.CONTEXT.StateConsumer>
                <output htmlFor="testEquivalenceTargetFile">
                    <p>
                        {
                            this.state.isEqual === null
                                ? '-- ??? --'
                                : this.state.isEqual
                                    ? '-- Equivalent --'
                                    : '-- Not Equivalent --'
                        }
                    </p>
                    <p>
                        {this.state.witnessString}
                    </p>
                </output>
            </fieldset>
        );
    }
}

export default TestingEquivalenceSection;
