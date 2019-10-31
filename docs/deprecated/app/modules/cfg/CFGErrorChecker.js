import {SUCCESS_LAYOUT_ID, ERROR_LAYOUT_ID} from 'session/manager/notification/NotificationManager.js';
import {
    MACHINE_ERROR_NOTIFICATION_TAG
} from './components/notifications/CFGNotifications.js';

class CFGErrorChecker
{
    constructor(app, machineController)
    {
        this._app = app;
        this._machineController = machineController;
        this._showErrorOnChange = false;

        this.onGrammarChange = this.onGrammarChange.bind(this);

        machineController.getGrammarChangeHandler().addListener(this.onGrammarChange);
    }

    onGrammarChange(grammar)
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

        const app = this._app;
        const notificationManager = app.getNotificationManager();

        notificationManager.clearNotifications(MACHINE_ERROR_NOTIFICATION_TAG);
        if (errors.length <= 0)
        {
            notificationManager.pushNotification(
                I18N.toString('message.error.none'),
                SUCCESS_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, null, false);
        }
        else
        {
            for(const error of errors)
            {
                notificationManager.pushNotification(error.name + ' - ' + error.message,
                    ERROR_LAYOUT_ID, MACHINE_ERROR_NOTIFICATION_TAG, null, false);
            }
        }
    }
}

export default CFGErrorChecker;
