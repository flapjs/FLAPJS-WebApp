import { solveDFA } from 'machine/util/solveDFA.js';
import { solveNFA, solveNFAbyStep } from 'machine/util/solveNFA.js';

import { DFA } from 'machine/DFA.js';

class TestMode
{
  constructor(machineBuilder, testingManager)
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
    this.checkedStates = [];
    this.running = false;
    this.started = false;
  }

  onStart()
  {
    //Check the machine, if DFA, then it must be a valid DFA
    /*if (this.machineBuilder.getMachineType() == "DFA")
    {
      const dfa = this.machineBuilder.toDFA();
      if (!dfa.validate()) return;
    }*/

    this.history.length = 0;
    this.prepareForNewTest();

    this.started = true;
  }

  onStop()
  {
    this.history.length = 0;

    this.started = false;
  }

  isStarted()
  {
    return this.started;
  }

  onResume()
  {
    this.running = true;
    while(this.running)
    {
      this.onNextStep();
    }
    console.log("Finished tests...");
  }

  onPause()
  {
    this.running = false;
  }

  onPreviousStep()
  {
    this.history.pop();
    const previous = this.history[this.history.length - 1];

    //Reset targets
    this.targets.length = 0;
    for(const state of previous)
    {
      this.targets.push(state);
    }

    //Reset test index
    if (this.indexofString <= 0)
    {
      //Go to previous test string
      this.testingManager.prevTestInput();

      this.prepareForNewTest();
    }
    else
    {
      --this.indexofString;
    }
  }

  onNextStep()
  {
    const testInput = this.testingManager.getCurrentTestInput();
    const fsa = this.machineBuilder.getMachine();
    if (!testInput)
    {
      //End of test!
      console.log("= End of test =");
      this.onPause();
      return false;
    }

    //Get next character of current test string
    console.log("Getting next character....");
    this.indexofString += 1;

    //If no more characters to get...
    if(this.indexofString >= testInput.value.length)
    {
      //End of test string
      console.log("...end of test string...");

      //Run it one more time...
      this.result = solveNFAbyStep(fsa, null, this.cachedStates, this.cachedSymbols, this.checkedStates);
      testInput.setResult(this.result);
      const result = this.testingManager.nextTestInput();
      console.log("...setting up for another test...");
      console.log(JSON.stringify(this.testingManager.getCurrentTestInput()));

      this.running = false;//Stop the resume at each string

      this.prepareForNewTest();
      return true;
    }
    else
    {
      let nextChar = testInput.value[this.indexofString];
      console.log("The next character (should never be null): " + nextChar);

      this.result = solveNFAbyStep(fsa, nextChar, this.cachedStates, this.cachedSymbols, this.checkedStates);

      //Update targets
      this.targets.length = 0;
      for(const state of this.cachedStates)
      {
        this.targets.push(state);
      }
      console.log("For that character, the next state is: " + JSON.stringify(this.cachedStates));

      //Update history
      this.history.push(this.cachedStates);

      console.log("Have we reached the end? " + this.result);
      return true;
    }
  }

  getCurrentTestStringIndex()
  {
    return this.indexofString;
  }

  prepareForNewTest()
  {
    const startState = this.machineBuilder.getMachine().getStartState();
    this.cachedStates.length = 0;
    this.cachedSymbols.length = 0;
    this.checkedStates.length = 0;

    this.history.push(startState);
    this.cachedStates.push({state: startState, index: 0});
    this.indexofString = -1;
  }
}

export default TestMode;
