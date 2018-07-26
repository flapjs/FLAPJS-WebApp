import { solveNFA } from 'machine/util/solveNFA.js';

const PENDING = 0;
const SUCCESS = 1;
const FAILURE = -1;

class TestingManager
{
  constructor(graph)
  {
    this.graph = graph;
    this.inputs = [];
    
    this.placeholder = new TestingInput();

    this.graph.on("markDirty", (g) => {
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

  clear()
  {
    this.inputs.length = 0;
  }

  testPlaceholder()
  {
    return this.testByInput(this.placeholder);
  }

  testByInput(input, machine=null)
  {
    if (!machine) machine = this.graph.toNFA();
    input.result = PENDING;
    const result = solveNFA(machine, input.value);
    input.result = result ? SUCCESS : FAILURE;
    input.dirty = false;
    return result;
  }

  testByIndex(index, machine=null)
  {
    if (!machine) machine = this.graph.toNFA();
    if (index < 0 || index >= this.inputs.length) return false;
    return this.testByInput(this.inputs[index], machine);
  }

  testAll(machine=null)
  {
    if (!machine) machine = this.graph.toNFA();

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
