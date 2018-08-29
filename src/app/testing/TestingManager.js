import { guid } from 'util/MathHelper.js';
import { solveNFA } from 'machine/util/solveNFA.js';

import TestMode from './TestMode.js';
import TestingInputList from './TestingInputList.js';

class TestingManager
{
  constructor()
  {
    this.machineController = null;

    this.inputList = new TestingInputList();

    this.shouldCheckError = false;
    this.isImmediateErrorCheck = false;
    this.errorCheckMode = TestingManager.NO_ERROR_CHECK;
    this.stepByStepMode = false;

    this.testMode = new TestMode(this);
  }

  initialize(app)
  {
    this.machineController = app.machineController;

    this.testMode.initialize(app);
  }

  destroy()
  {

  }

  setErrorCheckMode(mode)
  {
    const machineBuilder = this.machineController.getMachineBuilder();

    //Update machine builder error checker
    machineBuilder.setMachineType(machineBuilder.getMachineType());

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
}
TestingManager.NO_ERROR_CHECK = "none";
TestingManager.DELAYED_ERROR_CHECK = "delayed";
TestingManager.IMMEDIATE_ERROR_CHECK = "immediate";

export default TestingManager;
