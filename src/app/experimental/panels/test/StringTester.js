import Eventable from 'util/Eventable.js';
import { solveNFAbyStep } from 'machine/util/solveNFA.js';

import TapeContext from './TapeContext.js';

class TestTapeContext extends TapeContext
{
  constructor(tester, graphController, machineController)
  {
    super(tester.getTestString(), false, true);

    this._tester = tester;
    this._graphController = graphController;
    this._machineController = machineController;
  }

  //Override
  stepForward()
  {
    const graphController = this._graphController;
    const machineController = this._machineController;
    this._tester.stepForward(graphController, machineController);
  }

  //Override
  stepBackward()
  {
    const graphController = this._graphController;
    const machineController = this._machineController;
    this._tester.stepBackward(graphController, machineController);
  }

  //Override
  reset()
  {
    this._tester.resetPosition();
  }

  //Override
  finish()
  {
    const graphController = this._graphController;
    const machineController = this._machineController;
    this._tester.runTest(graphController, machineController, false);
  }

  //Override
  stop()
  {
    this._tester.stopTest();
  }

  //Override
  changeTapeSymbol(index, symbol="")
  {
    throw new Error("Operation not yet supported");
  }

  //Override
  getTapeSourceStatesByIndex(index)
  {
    if (index < 0 || index >= this._tapeInput.length) return [];
    return this._tester.getNodesAtPosition(index);
  }

  //Override
  getTapeSymbolByIndex(index)
  {
    if (index < 0 || index >= this._tapeInput.length) return [];
    return this._tapeInput[index] || "";
  }

  //Override
  setCurrentTapeIndex(index)
  {
    this._tester.changePosition(index);
  }

  //Override
  getCurrentTapeIndex()
  {
    return this._tester.getPosition();
  }
}

class StringTester
{
  constructor()
  {
    this._testString = null;
    this._testIndex = -1;

    this._tapeContext = null;

    //For nfa solver use
    this._cachePath = [];
    this._cachedResult = false;
    this._resolve = null;
    this._reject = null;

    this.registerEvent("startTest");
    this.registerEvent("stepTest");
    this.registerEvent("stopTest");
  }

  startTest(testString, graphController, machineController)
  {
    if (!testString) testString = "";
    if (this._tapeContext) throw new Error("Unable to start an already running test");

    this._testString = testString;
    this._testIndex = -1;
    this._cachePath.length = 0;
    this._cachedResult = false;
    this._tapeContext = new TestTapeContext(this, graphController, machineController);

    this.emit("startTest", this);

    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  stopTest()
  {
    if (!this._tapeContext) throw new Error("Unable to stop null test");

    this.emit("stopTest", this);

    if (!this._resolve) throw new Error("Must call startTest() before anything else");
    if (!this._reject) throw new Error("Must call startTest() before anything else");

    let testResult = null;
    if (this._cachePath.length >= this._testString.length)
    {
      testResult = this._cachedResult;
      this._resolve(testResult);
    }
    else
    {
      testResult = null;
      this._reject();
    }

    this._testString = null;
    this._testIndex = -1;
    this._cachePath.length = 0;
    this._cachedResult = false;
    this._tapeContext = null;

    return Promise.resolve(testResult);
  }

  runTest(graphController, machineController, thenStop=false)
  {
    if (!this._tapeContext) throw new Error("Unable to run null test");

    return new Promise((resolve, reject) => {
      let result = false;
      do
      {
        result = this.stepForward(graphController, machineController, !thenStop);
      }
      while (result);

      resolve(this._cachedResult);
    }).then((result) => {
      if (thenStop) return this.stopTest();
      else return result;
    });
  }

  stepForward(graphController, machineController, cacheStep=true)
  {
    if (!this._testString || this._testString.length <= 0) return false;
    if (this._testIndex >= this._testString.length - 1) return false;
    ++this._testIndex;

    if (this._cachePath.length <= this._testIndex)
    {
      //Calculate current step...
      const nextSymbol = this._testString[this._testIndex];
      const targets = new Set();
      let cachedStates, cachedSymbols, checkedStates = null;

      if (this._testIndex > 0 && this._testIndex >= this._cachePath.length)
      {
        const prevCache = this._cachePath[this._testIndex - 1];
        cachedStates = prevCache.states.slice();
        cachedSymbols = prevCache.symbols.slice();
        checkedStates = prevCache.checked.slice();
      }
      else
      {
        cachedStates = [];
        cachedSymbols = [];
        checkedStates = [];
      }

      const fsa = machineController.getMachineBuilder().getMachine();
      const graph = graphController.getGraph();
      this._cachedResult = solveNFAbyStep(fsa, nextSymbol, cachedStates, cachedSymbols, checkedStates);

      for(const state of cachedStates)
      {
        let node = machineController.getFirstGraphNodeByLabel(graph, state.state);

        //Couldn't find the node that was solved for this step...
        if (!node) throw new Error("Could not find node by label \'" + state.state + "\'");

        targets.add(node);
      }

      //Store current step...
      const nextCache = {
        targets: Array.from(targets),
        states: cachedStates,
        symbols: cachedSymbols,
        checked: checkedStates
      };

      this._cachePath.push(nextCache);
    }
    else
    {
      //Go forward a previously calculated step...by doing nothing...
    }

    this.emit("stepTest");
    return true;
  }

  stepBackward(graphController, machineController)
  {
    if (this._testIndex <= 0) return false;
    --this._testIndex;

    //Go back a step...by doing nothing...
    this.emit("stepTest");
    return true;
  }

  isTesting()
  {
    return this._testString !== null;
  }

  changePosition(position)
  {
    if (position >= this._cachePath.length)
    {
      this._testIndex = this._cachePath.length - 1;
    }
    else
    {
      if (position < 0)
      {
        this._testIndex = 0;
      }
      else if (position >= this._testString.length)
      {
        this._testIndex = this._testString.length - 1;
      }
      else
      {
        this._testIndex = position;
      }
    }
  }

  resetPosition()
  {
    this._testIndex = -1;
  }

  getPosition()
  {
    return this._testIndex;
  }

  getCurrentNodes()
  {
    if (this._testIndex >= 0 && this._testIndex < this._cachePath.length)
    {
      return this._cachePath[this._testIndex];
    }
    else
    {
      return null;
    }
  }

  getNodesAtPosition(position)
  {
    if (position >= 0 && position < this._cachePath.length)
    {
      return this._cachePath[position].targets;
    }
    else
    {
      return null;
    }
  }

  getTestString()
  {
    return this._testString;
  }

  getTapeContext()
  {
    return this._tapeContext;
  }
}
Eventable.mixin(StringTester);

export default StringTester;
