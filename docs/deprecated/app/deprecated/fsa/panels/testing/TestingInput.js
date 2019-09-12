import React from 'react';
import './TestingInput.css';

import Config from 'deprecated/config.js';
import { EMPTY } from 'deprecated/fsa/machine/Symbols.js';

import IconButton from 'deprecated/icons/IconButton.js';
import AddIcon from 'deprecated/icons/AddIcon.js';
import RemoveIcon from 'deprecated/icons/RemoveIcon.js';

import StatusButton from './StatusButton.js';

class TestingInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = React.createRef();

        this.onStatusClick = this.onStatusClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    getInput()
    {
        return this.props.testList.getInputByIndex(this.props.index);
    }

    isInputFirst()
    {
        return this.props.index === 0;
    }

    onStatusClick(e)
    {
        this.props.testList.testByIndex(this.props.index, this.props.machineBuilder.getMachine());
    }

    onSubmitClick(e)
    {
        if (this.isInputFirst())
        {
            const src = this.getInput();

            //Add test input to list
            const newTest = this.props.testList.addInput(src.value);
            //Copy result to new test (should not be setResult)
            newTest.result = src.result;
            newTest.dirty = src.dirty;

            //Delete already processed test
            src.value = '';
            src.result = null;
            src.dirty = true;

            //Reselect the target
            this.ref.focus();
        }
        else
        {
            //Remove test input from list
            this.props.testList.removeInputByIndex(this.props.index);
        }
    }

    onValueChange(e)
    {
        const value = e.target.value.trim();
        const src = this.getInput();
        src.value = value;
        src.dirty = true;
    }

    onKeyDown(e)
    {
    //If it is an 'enter', don't put in a new line...
        if (e.keyCode === Config.SUBMIT_KEY)
        {
            e.preventDefault();
        }
        //Delete it if there is no value in it
        else if (e.keyCode === Config.DELETE_KEY)
        {
            const src = this.getInput();
            if (src.value.length <= 0)
            {
                const nextIndex = this.props.index + 1;
                //Replace this input with the next one if there is one...
                //Also, cannot delete first input, but this will never get there :)
                if (this.props.testList.getTests().length > nextIndex)
                {
                    const nextInput = this.props.testList.getInputByIndex(nextIndex);
                    src.value = nextInput.value;
                    src.result = nextInput.result;
                    src.dirty = nextInput.dirty;

                    this.props.testList.removeInputByIndex(nextIndex);
                }
            }
        }
    }

    onKeyUp(e)
    {
        if (e.keyCode === Config.SUBMIT_KEY)
        {
            const shouldTestOnly = e.shiftKey;

            //Should try to add and NOT run
            if (this.isInputFirst() && !shouldTestOnly)
            {
                const src = this.getInput();

                //Add test input to list
                const newTest = this.props.testList.addInput(src.value);
                //Copy result to new test (should not be setResult)
                newTest.result = src.result;
                newTest.dirty = src.dirty;

                //Delete already processed test
                src.value = '';
                src.result = null;
                src.dirty = true;

                //Refocus the target
                this.ref.focus();
            }
            //Should try to run ONLY
            else
            {
                this.props.testList.testByIndex(this.props.index, this.props.machineBuilder.getMachine());

                //Select everything again
                this.ref.select();
            }
        }
        else if (e.keyCode === Config.CLEAR_KEY)
        {
            e.target.blur();
        }
    }

    render()
    {
        const src = this.getInput();
        const first = this.isInputFirst();
        return <div className={'testinginput-container ' +
      (this.props.testList.getCurrentInputIndex() === this.props.index ? ' active' : '')}>

            <StatusButton active={!src.dirty} mode={src.result} onClick={this.onStatusClick}/>

            <input ref={ref=>this.ref=ref} className="testinginput-field"
                value={src.value}
                placeholder={EMPTY}
                onChange={this.onValueChange}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp}
                onFocus={(e)=>e.target.select()}/>

            <IconButton className="testinginput-submit" onClick={this.onSubmitClick}>
                {first ? <AddIcon/> : <RemoveIcon/>}
            </IconButton>
        </div>;
    }
}

export default TestingInput;
