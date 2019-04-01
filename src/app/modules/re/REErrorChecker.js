import Notifications from 'deprecated/system/notification/Notifications.js';

export const ERROR_MESSAGE_TAG = "re_build_error";

class REErrorChecker
{
  constructor(machineController)
  {
    this._machineController = machineController;
    this._showErrorOnChange = false;

    this.onExpressionChange = this.onExpressionChange.bind(this);

    machineController.getExpressionChangeHandler().addListener(this.onExpressionChange);
  }

  onExpressionChange(expression)
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
    const errors = this._machineController.getMachine().getErrors();

    Notifications.clearMessages(ERROR_MESSAGE_TAG);
    if (errors.length <= 0)
    {
      Notifications.addMessage(I18N.toString("message.error.none"), "success", ERROR_MESSAGE_TAG, null, null, false);
    }
    else
    {
      for(const error of errors)
      {
        Notifications.addErrorMessage(error.name + " - " + error.message, ERROR_MESSAGE_TAG, null, null, false);
      }
    }
  }
}

export default REErrorChecker;
