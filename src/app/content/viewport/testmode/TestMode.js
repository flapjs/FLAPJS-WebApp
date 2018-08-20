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

    this.timer = null;
  }

  onStart()
  {
    //Check the machine, if DFA, then it must be a valid DFA
    /*if (this.machineBuilder.getMachineType() == "DFA")
    {
      const dfa = this.machineBuilder.toDFA();
      if (!dfa.validate()) return;
    }*/
    this.prepareForNewTest();
    this.started = true;
  }

  onResume()
  {
    this.running = true;

    const STEPTIME = 500;
    const step = () => {
      if (this.running)
      {
        this.onNextStep();
        this.timer = setTimeout(step, STEPTIME);
      }
      else
      {
        console.log("Finished tests...");
      }
    };
    this.timer = setTimeout(step, STEPTIME);
  }

  onPause()
  {
    this.running = false;
  }

  onStop()
  {
    this.targets.length = 0;

    this.started = false;
  }

  isRunning()
  {
    return this.running;
  }

  isStarted()
  {
    return this.started;
  }

  hasPrevStep()
  {
    return this.testingManager.getCurrentTestInput();
  }

  onPreviousStep()
  {
    console.log(this.history[1])
    if (this.history){
      const previous = this.history[this.history.length - 1];
      this.history.pop()
      this.targets.length = 0;
      for(const state of previous)
      {
        this.targets.push(state);

      }
      this.indexofString--;
    }

    else{
      this.testingManager.prevTestInput();
    }
  }

  hasNextStep()
  {
    return this.testingManager.getCurrentTestInput();
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

      //Stop the resume at each string
      //this.running = false;

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
      console.log(this.cachedStates)
      for(const state of this.cachedStates)
      {
        this.targets.push(this.machineBuilder.graph.getNodeByLabel(state.state));
      }
      console.log("For that character, the next state is: " + JSON.stringify(this.cachedStates));

      //Update history
      console.log(this.targets)
      this.history.push(this.targets);
      console.log(this.history[this.history.length - 1])
      console.log("Have we reached the end? " + this.result);
      return true;
    }
  }

  getCurrentTestStringIndex()
  {
    return this.indexofString + 1;
  }

  prepareForNewTest()
  {
    const startState = this.machineBuilder.getMachine().getStartState();
    const startNode = this.machineBuilder.graph.getStartNode();
    this.cachedStates.length = 0;
    this.cachedSymbols.length = 0;
    this.checkedStates.length = 0;
    this.targets.length = 0;
    this.targets.push(startNode)
    this.history.length = 0;
    this.history.push(startNode);
    this.cachedStates.push({state: startState, index: 0});
    this.indexofString = -1;
  }
}

export default TestMode;
