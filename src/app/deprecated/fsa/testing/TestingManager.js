import Viewport from 'deprecated/content/viewport/Viewport.js';
import TestMode from './TestMode.js';
import TestingInputList from './TestingInputList.js';

class TestingManager
{
    constructor()
    {
        this.machineController = null;
        this.viewport = null;

        this.inputList = new TestingInputList();

        this.shouldCheckError = false;
        this.isImmediateErrorCheck = false;
        this.errorCheckMode = TestingManager.NO_ERROR_CHECK;
        this.stepByStepMode = false;

        this.testMode = new TestMode(this);
    }

    initialize(module, viewport)
    {
        this.machineController = module.getMachineController();
        this.viewport = viewport;

        this.testMode.initialize(module);
    }

    destroy()
    {

    }

    setErrorCheckMode(mode)
    {
    //Update machine builder error checker
        this.machineController.setMachineType(this.machineController.getMachineType());

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
            throw new Error('Unknown error check mode \'' + mode + '\'');
        }
    }

    getErrorCheckMode()
    {
        return this.errorCheckMode;
    }

    setStepByStepMode(mode)
    {
        this.stepByStepMode = mode ? true : false;
        if (mode)
        {
            if (this.testMode.isStarted()) this.testMode.onStop();
            this.testMode.onStart();
            this.viewport.setState((prev, props) => 
            {
                if (prev.mode != Viewport.TESTING)
                {
                    return {
                        prevMode: prev.mode,
                        mode: Viewport.TESTING
                    };
                }
                else
                {
                    //It's already the correct viewport mode
                }
            });
        }
        else
        {
            if (this.testMode.isStarted()) this.testMode.onStop();
            this.viewport.setState((prev, props) => 
            {
                return {mode: prev.prevMode};
            });
        }
    }

    getStepByStepMode()
    {
        return this.stepByStepMode;
    }
}
TestingManager.NO_ERROR_CHECK = 'none';
TestingManager.DELAYED_ERROR_CHECK = 'delayed';
TestingManager.IMMEDIATE_ERROR_CHECK = 'immediate';

export default TestingManager;
