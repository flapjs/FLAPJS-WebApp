import Notifications from 'system/notification/Notifications.js';
import TransitionErrorMessage from './notifications/TransitionErrorMessage.js';
import StateUnreachableWarningMessage from './notifications/StateUnreachableWarningMessage.js';
import StateErrorMessage from './notifications/StateErrorMessage.js';

import { ERROR_UNREACHABLE_STATE,
  ERROR_DUPLICATE_STATE,
  ERROR_INCOMPLETE_TRANSITION } from './machine/PDABuilder.js';

export const ERROR_MESSAGE_TAG = "pda_build_error";

class PDAErrorChecker
{
  constructor(graphController, machineController)
  {
    this._graphController = graphController;
    this._machineController = machineController;
    this._showErrorOnChange = false;

    this.onMachineChange = this.onMachineChange.bind(this);

    machineController.getMachineBuilder().getMachineChangeHandler().addListener(this.onMachineChange);
  }

  onMachineChange(machineBuilder)
  {
    if (this._showErrorOnChange)
    {
      this.showErrors();
    }
  }

  setErrorChecking(enabled)
  {
    this._showErrorOnChange = enabled;
  }

  isErrorChecking()
  {
    return this._showErrorOnChange;
  }

  showErrors()
  {
    const props = {graphController: this._graphController, machineController: this._machineController};
    const machineBuilder = this._machineController.getMachineBuilder();
    const errors = machineBuilder.getMachineErrors();
    const warnings = machineBuilder.getMachineWarnings();

    Notifications.clearMessages(ERROR_MESSAGE_TAG);
    if (errors.length <= 0 && warnings.length <= 0)
    {
      Notifications.addMessage(I18N.toString("message.error.none"), "success", ERROR_MESSAGE_TAG, null, null, false);
    }
    else
    {
      for(const warning of warnings)
      {
        switch(warning.name)
        {
          case ERROR_DUPLICATE_STATE:
            Notifications.addMessage({
              text: "Found duplicate nodes of similar names",
              targets: warning.nodes},
              "warning", ERROR_MESSAGE_TAG, StateErrorMessage, props, false);
          break;
          case ERROR_UNREACHABLE_STATE:
            Notifications.addMessage(warning.nodes,
              "warning", ERROR_MESSAGE_TAG, StateUnreachableWarningMessage, props, false);
          break;
        }
      }

      for(const error of errors)
      {
        switch(error.name)
        {
          case ERROR_INCOMPLETE_TRANSITION:
            Notifications.addMessage({
              text: I18N.toString("message.error.incomplete"),
              targets: error.edges
            }, "error", ERROR_MESSAGE_TAG, TransitionErrorMessage, props, false);
          break;
        }
      }
    }
  }
}

export default PDAErrorChecker;
