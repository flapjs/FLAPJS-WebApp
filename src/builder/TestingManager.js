import { solveNFA } from 'machine/util/solveNFA.js';

const PENDING = 0;
const SUCCESS = 1;
const FAILURE = -1;

class TestingManager
{
  constructor()
  {
    this.inputs = [];

    this.shouldCheckError = false;
    this.isImmediateErrorCheck = false;
    this.errorCheckMode = TestingManager.NO_ERROR_CHECK;
    this.stepByStepMode = false;

    this.placeholder = new Test();
  }

  setErrorCheckMode(mode)
  {
    if (mode == TestingManager.NO_ERROR_CHECK)
    {
      this.shouldCheckError = false;
      this.errorCheckMode = mode;
    }
    else if (mode == TestingManager.DELAYED_ERROR_CHECK)
    {
      this.shouldCheckError = true;
      this.isImmediateErrorCheck = false;
      this.errorCheckMode = mode;
    }
    else if (mode == TestingManager.IMMEDIATE_ERROR_CHECK)
    {
      this.shouldCheckError = true;
      this.isImmediateErrorCheck = true;
      this.errorCheckMode = mode;
    }
    else
    {
      throw new Error("Unknown error check mode \'" + mode + "\'");
    }
  }

  getErrorCheckMode()
  {
    return this.errorCheckMode;
  }

  setStepByStepMode(mode)
  {
    this.stepByStepMode = mode ? true : false;
  }

  getStepByStepMode()
  {
    return this.stepByStepMode;
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
TestingManager.NO_ERROR_CHECK = "none";
TestingManager.DELAYED_ERROR_CHECK = "delayed";
TestingManager.IMMEDIATE_ERROR_CHECK = "immediate";

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
