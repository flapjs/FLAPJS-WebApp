import NFA from 'machine/NFA.js';

class FSABuilder
{
  constructor(graph)
  {
    this.graph = graph;

    this._machine = new NFA();

    this.errorMessages = [];
    this.errorNodes = [];
    this.errorEdges = [];
  }

  checkErrors()
  {
    //Check for missing transitions
  }

  getMachine()
  {
    this._machine.clear();
    return this.graph._toNFA(this._machine);
  }
}

export default FSABuilder;
