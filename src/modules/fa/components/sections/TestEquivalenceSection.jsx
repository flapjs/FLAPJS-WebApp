import React from 'react';

// import { isEquivalentFSAWithWitness } from '@flapjs/modules/fa/machine/util/EqualFSA';
// import { createMachineFromFileBlob } from './MachineLoader.js';

class TestEquivalenceSection extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            isEqual: null,
            witnessString: '',
        };

        this.onPerformEquivalenceTest = this.onPerformEquivalenceTest.bind(this);
        this.onTargetFileUpload = this.onTargetFileUpload.bind(this);
    }

    onPerformEquivalenceTest()
    {
        /*
        createMachineFromFileBlob(e)
            .then(result =>
            {
                const session = this.props.session;
                const currentModule = session.getCurrentModule();
                const machineController = currentModule.getMachineController();
                const machineBuilder = machineController.getMachineBuilder();
                const currentMachine = machineBuilder.getMachine();
                const equivalenceResult = isEquivalentFSAWithWitness(result, currentMachine);
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
            })
            .catch(err =>
            {
                this.setState({ isEqual: null, witnessString: err.message });
            });
        */
    }

    onTargetFileUpload(e)
    {
        const files = e.target.files;
        if (files.length > 0)
        {
            this.onEquivalentTest(files[0]);

            //Makes sure you can upload the same file again.
            e.target.value = '';
        }
    }

    /** @override */
    render()
    {
        return (
            <>
            <input type="file" name="import"
                id="testEquivalenceTargetFile"
                onChange={this.onTargetFileUpload}/>
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
            </>
        );
    }
}

export default TestEquivalenceSection;
