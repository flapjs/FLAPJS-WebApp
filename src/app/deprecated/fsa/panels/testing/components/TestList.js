import React from 'react';
import './TestList.css';

import TestInput from './TestInput.js';

class TestList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onUploadFileChange = this.onUploadFileChange.bind(this);
    }

    onUploadFileChange(e)
    {
        const tester = this.props.tester;

        //Clear the tester for import
        tester.clear(true);

        const target = e.target;
        if (!target) return;

        const files = target.files;
        if (!Array.isArray(files)) return;

        const fileBlob = target.files[0];
        if (!fileBlob) return;

        const reader = new FileReader();
        reader.onload = (event) => 
        {
            const data = event.target.result;
            try
            {
                const testInputs = data.split('\n');
                if (testInputs.length <= 0)
                {
                    tester.addTestInput('');
                }
                else
                {
                    for(const testInput of testInputs)
                    {
                        tester.addTestInput(testInput.trim());
                    }
                }
            }
            catch(e)
            {
                reader.abort();
            }
        };
        reader.readAsText(fileBlob);
    }

    render()
    {
        const tester = this.props.tester;
        const machineBuilder = this.props.machineBuilder;

        return <div className="test-inputlist-container">
            <button className="panel-button" onClick={()=>
            {
                const machine = machineBuilder.getMachine();
                tester.testPlaceholder(machine);
                tester.testAll(machine);
            }}>
                {I18N.toString('action.testing.runall')}
            </button>

            <div className="scrollbar-container">
                <div className="test-inputlist-content">
                    <TestInput placeholder={true} index={-1} machineBuilder={machineBuilder} tester={tester} src={tester.placeholder}/>
                    {
                        tester.inputs.map((e, i) => 
                        {
                            if (!e) return null;

                            return <TestInput key={e.id} index={i} machineBuilder={machineBuilder} tester={tester} src={e}/>;
                        })
                    }
                    <button className="panel-button"
                        onClick={()=>tester.clear(true)}>
                        {I18N.toString('action.testing.clear')}
                    </button>
                </div>
            </div>

            <button className="panel-button" id="test-upload">
                <input id="test-upload-input" type="file" name="import" style={{display: 'none'}}
                    onChange={this.onUploadFileChange} accept=".txt"/>
                <label htmlFor="test-upload-input">
                    {I18N.toString('action.testing.import')}
                </label>
            </button>
        </div>;
    }
}

export default TestList;
