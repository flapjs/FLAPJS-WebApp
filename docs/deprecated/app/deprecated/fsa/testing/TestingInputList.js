import { guid } from 'util/MathHelper.js';

import { solveNFA } from 'deprecated/fsa/machine/util/solveNFA.js';

const SUCCESS = true;
const FAILURE = false;
const PENDING = null;

//Only refer to input by index, NEVER by reference!
class TestingInputList
{
    constructor()
    {
        this.inputList = [];
        this.addInput('');

        this.inputIndex = 0;
    }

    isEmpty()
    {
        for(const input of this.inputList)
        {
            if (input.value.length > 0)
            {
                return false;
            }
        }

        return true;
    }

    testByIndex(index, machine)
    {
        if (index < 0 || index >= this.inputList.length)
        {
            throw new Error('Cannot find test input for index');
        }

        const input = this.inputList[index];
        input.setResult(null);
        //TODO: make this a promise
        const result = solveNFA(machine, input.value);
        input.setResult(result);
        return result;
    }

    importTests(file)
    {
        const reader = new FileReader();
        reader.onload = (event) => 
        {
            try
            {
                //The only time the first element is being removed (then replaced)
                this.inputList.length = 0;
                this.inputIndex = 0;

                const testInputs = event.target.result.split('\n');
                for(let testInput of testInputs)
                {
                    testInput = testInput.trim();
                    if (testInput.length > 0)
                    {
                        this.addInput(testInput);
                    }
                }

                //Make sure a first element exists
                if (this.inputList.length < 0)
                {
                    this.addInput('');
                }
            }
            catch(e)
            {
                reader.abort();
            }
        };
        reader.readAsText(file);
    }

    getTestsAsStrings()
    {
        return this.inputList.map((e, i) => e.value);
    }

    clearTests()
    {
    //Reset first element
        const first = this.inputList[0];
        first.value = '';
        first.result = null;
        first.dirty = true;

        //Reset list
        this.inputList.length = 1;
        this.inputIndex = 0;
    }

    resetTests(markDirty=true)
    {
        this.inputIndex = 0;

        if (markDirty)
        {
            for(const input of this.inputList)
            {
                input.dirty = true;
            }
        }
    }

    getTests()
    {
        return this.inputList;
    }

    addInput(value)
    {
        const input = {
            value: value,
            result: null,
            dirty: true,
            id: guid(),
            setResult(result)
            {
                this.dirty = false;
                this.result = result;
            }
        };

        this.inputList.push(input);
        return input;
    }

    getInputByIndex(index)
    {
        if (index < 0 || index >= this.inputList.length)
        {
            throw new Error('Cannot find test input for index');
        }

        return this.inputList[index];
    }

    removeInputByIndex(index)
    {
        if (index < 0 || index >= this.inputList.length)
        {
            throw new Error('Cannot find test input for index');
        }

        if (index === 0)
        {
            //Cannot delete the first input element
            throw new Error('Cannot delete the first test input');
        }

        if (index <= this.inputIndex)
        {
            --this.inputIndex;
        }

        this.inputList.splice(index, 1);
    }

    nextInput()
    {
        ++this.inputIndex;
        if (this.inputIndex >= this.inputList.length)
        {
            this.inputIndex = 0;
        }

        return this.inputList[this.inputIndex];
    }

    prevInput()
    {
        --this.inputIndex;
        if (this.inputIndex < 0)
        {
            this.inputIndex = this.inputList.length - 1;
        }

        return this.inputList[this.inputIndex];
    }

    resetInput()
    {
        this.inputIndex = 0;
    }

    hasNextInput()
    {
        return this.inputIndex < this.inputList.length;
    }

    hasPrevInput()
    {
        return this.inputIndex > 0;
    }

    getCurrentInput()
    {
        return this.inputList[this.inputIndex];
    }

    getCurrentInputIndex()
    {
        return this.inputIndex;
    }
}

export default TestingInputList;
