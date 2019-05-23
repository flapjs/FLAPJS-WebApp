import React from 'react';
import './TestInput.css';

import Config from 'deprecated/config.js';
import { EMPTY } from 'deprecated/fsa/machine/Symbols.js';

import IconButton from 'deprecated/icons/IconButton.js';
import AddIcon from 'deprecated/icons/AddIcon.js';
import RemoveIcon from 'deprecated/icons/RemoveIcon.js';

import StatusButton from './StatusButton.js';

class TestInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.inputElement = React.createRef();

        this.state = {
            src: this.props.src || {
                value: '',
                result: 0,
                dirty: true
            }
        };

        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onValueChange = this.onValueChange.bind(this);

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    onSubmitClick(e)
    {
        if (this.props.placeholder)
        {
            //Add test input to list
            this.props.tester.addTestInput(this.state.src.value);

            this.inputElement.focus();
            this.inputElement.select();
        }
        else
        {
            //Remove test input from list
            this.props.tester.removeTestInputByIndex(this.props.index);
        }
    }

    onValueChange(e)
    {
        const value = e.target.value;
        this.state.src.value = value;
        this.state.src.dirty = true;
    }

    onKeyDown(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY || e.keyCode === Config.CLEAR_KEY)
        {
            e.preventDefault();
        }
    }

    onKeyUp(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY)
        {
            const tester = this.props.tester;
            const machineBuilder = this.props.machineBuilder;
            const skipTest = e.shiftKey;

            //Add input if placeholder and Run
            if (this.props.placeholder)
            {
                if (!skipTest) tester.testPlaceholder(machineBuilder.getMachine());
                //Add test input to list
                const newTest = tester.addTestInput(this.state.src.value);
                //Save result to new test
                newTest.result = tester.placeholder.result;
                newTest.dirty = tester.placeholder.dirty;

                //Delete already processed test
                this.state.src.value = '';
                tester.placeholder.dirty = true;
                this.inputElement.focus();
            }
            //Otherwise just run it
            else
            {
                if (!skipTest) tester.testByIndex(this.props.index, machineBuilder.getMachine());

                //Select everything again
                this.inputElement.select();
            }
        }
        else if (e.keyCode === Config.CLEAR_KEY)
        {
            e.target.blur();
        }
    }

    render()
    {
        const tester = this.props.tester;
        const machineBuilder = this.props.machineBuilder;
        const src = this.state.src;

        return <div className={'test-input-container' +
      (this.props.placeholder ? ' test-input-placeholder' : '')}>

            <StatusButton active={!src.dirty} mode={src.result}
                onClick={()=>
                {
                    if (this.props.placeholder)
                    {
                        tester.testPlaceholder(machineBuilder.getMachine());
                    }
                    else
                    {
                        tester.testByIndex(this.props.index, machineBuilder.getMachine());
                    }
                }}/>

            <input ref={ref=>this.inputElement=ref} className="test-input-field"
                value={src.value}
                placeholder={this.props.placeholder ? I18N.toString('testing.placeholder') : EMPTY}
                onChange={this.onValueChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                onFocus={(e)=>e.target.select()}/>

            <IconButton className="test-input-addremove" onClick={this.onSubmitClick}>
                {this.props.placeholder ? <AddIcon/> : <RemoveIcon/>}
            </IconButton>
        </div>;
    }
}

export default TestInput;
