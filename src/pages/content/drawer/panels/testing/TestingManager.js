import { solveNFA } from 'machine/util/solveNFA.js';

import TestMode from 'pages/content/viewport/TestMode.js';

const PENDING = 0;
const SUCCESS = 1;
const FAILURE = -1;

class TestingManager
{
  constructor(machineBuilder)
  {
    this.machineBuilder = machineBuilder;
    this.inputs = [];

    this.autoErrorCheck = false;
    this.placeholder = new Test();
    this.testMode = new TestMode(machineBuilder, this);

    //HACK: this should be a listener to FSABuilder, should not access graph
    this.machineBuilder.graph.on("markDirty", (g) => {
      this.placeholder.dirty = true;
      for(const input of this.inputs)
      {
        if (input == null) return;
        input.dirty = true;
      }
    });
  }
  getCurrentTestString()
  {
    //TODO:GEt the test STRING not input
    return "";
  }
  nextTestInput()
  {
    //TODO:CAN RETURN NULL IF NO MORE INPUTS TO TEST
    //TODO:Returns TestingInput objects
    return null;
  }
  addTestInput(input)
  {
    const result = new Test(input);
    this.inputs.push(result);
    return result;
  }

  removeTestInputByIndex(index)
  {
    this.inputs[index] = null;
    //HACK: this.inputs.splice(index, 1);
    //TODO: This is so that the 'key' is unique AND consistent
  }

  clear(clearPlaceholder=false)
  {
    this.inputs.length = 0;
    if (clearPlaceholder)
    {
      //This is not a hack, because it is NOT a React.Component
      this.placeholder.value = "";
    }
  }

  testPlaceholder()
  {
    return this.testByInput(this.placeholder);
  }

  testByInput(input, machine=null)
  {
    if (!machine) machine = this.machineBuilder.getMachine();
    input.result = PENDING;
    const result = solveNFA(machine, input.value);
    input.result = result ? SUCCESS : FAILURE;
    input.dirty = false;
    return result;
  }

  testByIndex(index, machine=null)
  {
    if (!machine) machine = this.machineBuilder.getMachine();
    if (index < 0 || index >= this.inputs.length) return false;
    return this.testByInput(this.inputs[index], machine);
  }

  testAll(machine=null)
  {
    if (!machine) machine = this.machineBuilder.getMachine();

    for(const input of this.inputs)
    {
      this.testByInput(input, machine);
    }
  }
}

class Test
{
  constructor(value="")
  {
    this.value = value;
    this.result = 0;
    this.dirty = true;
  }
}

export default TestingManager;
