import {SUCCESS_LAYOUT_ID, ERROR_LAYOUT_ID} from 'session/manager/notification/NotificationManager.js';
import {
    MACHINE_ERROR_NOTIFICATION_TAG
} from './components/notifications/RENotifications.js';

class REErrorChecker
{
    constructor(app, machineController)
    {
        this._app = app;
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

export default REErrorChecker;
