import { solveNFA } from 'machine/util/solveNFA.js';

const PENDING = 0;
const SUCCESS = 1;
const FAILURE = -1;

class TestingManager
{
  constructor()
  {
    this.inputs = [];

    this.autoErrorCheck = false;
    this.placeholder = new Test();
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

  testPlaceholder(machine)
  {
    return this.testByInput(this.placeholder, machine);
  }

  testByInput(input, machine)
  {
    input.result = PENDING;
    const result = solveNFA(machine, input.value);
    input.result = result ? SUCCESS : FAILURE;
    input.dirty = false;
    return result;
  }

  testByIndex(index, machine)
  {
    if (index < 0 || index >= this.inputs.length) return false;
    return this.testByInput(this.inputs[index], machine);
  }

  testAll(machine)
  {
    for(const input of this.inputs)
    {
      this.testByInput(input, machine);
    }
  }

  markDirty()
  {
    this.placeholder.dirty = true;
    for(const input of this.inputs)
    {
      if (input == null) continue;
      input.dirty = true;
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
