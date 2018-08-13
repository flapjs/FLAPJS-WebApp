import {solveDFA} from 'machine/util/solveDFA.js'
import {solveNFA, solveNFAbyStep} from 'machine/util/solveNFA.js'
import DFA from 'machine/DFA.js'

class TestMode
{
  constructor(machineBuilder,testingManager)
  {
    this.machineBuilder = machineBuilder;
    this.targets = [];
    this.history = [];
    this.indexofString = -1;
    this.testingManager = testingManager;
    this.result = false;
    //for nfa use
    this.cachedStates = [];
    this.cachedSymbols = [];
    cachedStates.push({state: nfa.getStartState(), index: 0});
    this.checkedStates = [];
    this.running = false;
  }
  onResume()
  {
    this.running = true;
    while(this.running == true)
    {
      this.oneNextStep();
    }
  }

  onPause()
  {
    this.running = false;
  }

  onPreviousStep()
  {
    this.targets.length = 0;
    this.history.pop();
    let previous = this.history[this.history.length - 1];
    this.targets.push(previous);
  }

  onNextStep()
  {
    let nextChar = this.getNextCharacter();
    this.targets.length = 0;
    const fsa = this.machineBuilder.getMachine();
    if(fsa instanceof DFA)
    {
      let state = fsa.doTransition(this.history[this.history.lengt-1], nextChar)
      this.targets.push(state);
      this.history.push(state);
      this.result = fsa.isFinalState(state);
    }
    else
    {
      this.result = solveNFAbyStep(fsa, nextChar, this.cachedStates,this.cachedSymbols,this.checkedStates);
      this.targets.push(this.cachedStates);
      this.history.push(this.cachedStates);
    }
  }

  getCurrentTestStringIndex()
  {
    return this.indexofString;
  }

  getNextCharacter()
  {
    if(this.indexofString == this.currentTestString.length - 1 || this.indexofString == -1)
    {
      if(this.indexofString == this.currentTestString.length - 1)
      {
        let test = this.testingManager.getTestInput();
        test.result = this.result;
      }
      this.testingManager.nextTestString();
      this.indexofString = -1;
    }
    this.indexofString += 1;
    return this.testingManager.getCurrentTestString()[this.indexofString];
  }
}
