import { solveNFA } from 'machine/util/solveNFA.js';

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
    this.placeholder = new TestingInput();

    //HACK: this should be a listener to FSABuilder, should not access graph
    this.machineBuilder.graph.on("markDirty", (g) => {
      this.placeholder.dirty = true;
      for(const input of this.inputs)
      {
        input.dirty = true;
      }
    });
  }

  addTestInput(input)
  {
    this.inputs.push(new TestingInput(input));
  }

  removeTestInputByIndex(index)
  {
    this.inputs.splice(index, 1);
  }

  clear(clearPlaceholder=false)
  {
    this.inputs.length = 0;
    if (clearPlaceholder)
    {
      //HACK: cannot access setState, so do it the old-fashion way
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

class TestingInput
{
  constructor(value="")
  {
    this.value = value;
    this.result = 0;
    this.dirty = true;
  }
}

export default TestingManager;
