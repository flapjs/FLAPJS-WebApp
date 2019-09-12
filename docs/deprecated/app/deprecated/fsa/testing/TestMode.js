//FIXME: FSABUILDER: these should be the other ones
import { solveDFA } from 'deprecated/fsa/machine/util/solveDFA.js';
import { solveNFA, solveNFAbyStep } from 'deprecated/fsa/machine/util/solveNFA.js';

import { DFA } from 'deprecated/fsa/machine/DFA.js';

const STEPTIME = 500;
const SKIPTIME = 50;

class TestMode
{
    constructor(testingManager)
    {
        this.graphController = null;
        this.machineController = null;

        this.testingManager = testingManager;

        this.targets = [];

        this.history = [];
        this.indexofString = -1;
        this.result = false;

        //for nfa use
        this.cachedStates = [];
        this.cachedSymbols = [];
        this.checkedStates = [];
        this.running = false;
        this.started = false;
        this.skipToEnd = false;

        this.timer = null;

        this.onNodeDestroy = this.onNodeDestroy.bind(this);
    }

    initialize(module)
    {
        this.graphController = module.getGraphController();
        this.machineController = module.getMachineController();

    //NOTE: This is not necessary because you can edit once in stepbystep mode
    //this.graphController.getGraph().on("nodeDestroy", this.onNodeDestroy);
    }

    destroy()
    {
    //this.graphController.getGraph().removeEventListener("nodeDestroy", this.onNodeDestroy);
    }

    onNodeDestroy(node)
    {
    //this.targets.splice(this.targets.indexOf(node), 1);
    }

    onStart()
    {
        this.prepareForNewTest();
        this.started = true;
        this.skipToEnd = false;
    }

    onResume()
    {
    //If at the end, restart!
        if (!this.hasNextStep())
        {
            this.testingManager.inputList.resetTests(false);
        }

        this.running = true;

        const step = () => 
        {
            if (this.running)
            {
                if (this.hasNextStep())
                {
                    this.onNextStep();
                    this.timer = setTimeout(step, STEPTIME);
                }
                else
                {
                    this.onPause();
                }
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

        this.running = false;
        this.started = false;
        this.skipToEnd = false;
    }

    isRunning()
    {
        return this.running;
    }

    isStarted()
    {
        return this.started;
    }

    isSkipping()
    {
        return this.skipToEnd;
    }

    hasPrevStep()
    {
        return this.history.length > 0 ||
      this.testingManager.inputList.hasPrevInput();
    }

    onPreviousStep()
    {
        if (this.history.length > 0)
        {
            const previous = this.history.pop();
            this.targets.length = 0;
            this.cachedStates.length = 0;
            this.cachedSymbols.length = 0;
            this.checkedStates.length = 0;

            //Copy the old step
            for(const target of previous.targets)
            {
                if (!target) throw new Error('Found null target');

                this.targets.push(target);
            }
            for(const state of previous.cachedStates)
            {
                this.cachedStates.push(state);
            }
            for(const symbol of previous.cachedSymbols)
            {
                this.cachedSymbols.push(symbol);
            }
            for(const state of previous.checkedStates)
            {
                this.checkedStates.push(state);
            }

            this.indexofString--;
        }
        else
        {
            this.indexofString = -1;
            this.testingManager.inputList.prevInput();
        }
    }

    hasNextStep()
    {
        return this.indexofString < this.testingManager.inputList.getCurrentInput().value.length ||
      this.testingManager.inputList.hasNextInput();
    }

    onNextStep()
    {
        const testInput = this.testingManager.inputList.getCurrentInput();
        const fsa = this.machineController.getMachineBuilder().getMachine();

        //Get next character of current test string
        this.indexofString += 1;

        //If no more characters to get...
        if(this.indexofString >= testInput.value.length)
        {
            //End of test string
            //Run it one more time...
            this.result = solveNFAbyStep(fsa, null, this.cachedStates, this.cachedSymbols, this.checkedStates);
            testInput.setResult(this.result);

            //If this is the last test input...
            if (!this.testingManager.inputList.hasNextInput())
            {
                //End of test!
                this.onPause();
                return false;
            }
            else
            {
                const result = this.testingManager.inputList.nextInput();

                //Stop the resume at each string
                //this.running = false;

                this.prepareForNewTest();
                return true;
            }
        }
        else
        {
            //Update history
            const currentStep = this.getCurrentCache();
            this.history.push(currentStep);

            //Run it
            let nextChar = testInput.value[this.indexofString];

            this.result = solveNFAbyStep(fsa, nextChar, this.cachedStates, this.cachedSymbols, this.checkedStates);
            //Update targets
            this.targets.length = 0;

            for(const state of this.cachedStates)
            {
                let node = this.machineController.getFirstGraphNodeByLabel(this.graphController.getGraph(), state.state);
                if (!node) throw new Error('Found null target');

                if (!this.targets.includes(node)) this.targets.push(node);
            }

            if (this.targets.length <= 0 && !this.running)
            {
                this.skipToEnd = true;
                const skipFunc = () => 
                {
                    if (this.skipToEnd)
                    {
                        this.indexofString += 1;
                        if (this.indexofString >= testInput.value.length)
                        {
                            this.skipToEnd = false;
                        }
                        else
                        {
                            setTimeout(skipFunc, SKIPTIME);
                        }
                    }
                };
                setTimeout(skipFunc, SKIPTIME);
            }

            return true;
        }
    }

    getCurrentCache()
    {
        return {
            targets: this.targets.slice(),
            cachedStates: this.cachedStates.slice(),
            cachedSymbols: this.cachedSymbols.slice(),
            checkedStates: this.checkedStates.slice()
        };
    }

    getCurrentTestStringIndex()
    {
        return this.indexofString + 1;
    }

    prepareForNewTest()
    {
        this.cachedStates.length = 0;

        const graph = this.graphController.getGraph();
        if (graph.isEmpty()) return;

        const machine = this.machineController.getMachineBuilder().getMachine();

        this.targets.length = 0;

        let startState = machine.getStartState();
        for (let curr_state of machine.doClosureTransition(startState))
        {
            //FIXME: FSABUILDER: when converting, getFirstGraphNodeByLabel should be by id
            this.cachedStates.push({state: curr_state, index: 0});
            const node = this.machineController.getFirstGraphNodeByLabel(graph, curr_state);
            if (!node) throw new Error('Found null target');
            this.targets.push(node);
        }

        this.cachedSymbols.length = 0;
        this.checkedStates.length = 0;
        this.indexofString = -1;
        this.history.length = 0;

        this.skipToEnd = false;
    }
}

export default TestMode;
