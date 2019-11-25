import React from 'react';

import DefaultNotificationLayout, {
    STYLE_TYPE_DEFAULT,
    STYLE_TYPE_WARNING,
    STYLE_TYPE_ERROR,
    STYLE_TYPE_SUCCESS
} from './components/DefaultNotificationLayout.jsx';
import SequenceNotificationLayout from './components/SequenceNotificationLayout.jsx';

export const DEFAULT_LAYOUT_ID = 'default';
export const WARNING_LAYOUT_ID = 'warning';
export const ERROR_LAYOUT_ID = 'error';
export const SUCCESS_LAYOUT_ID = 'success';
export const SEQUENCE_LAYOUT_ID = 'sequence';

export function initialize(notificationManager)
{
    //Overwrite any changes to default notifications...
    notificationManager.registerNotificationLayout(DEFAULT_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_DEFAULT} {...props} />);
    notificationManager.registerNotificationLayout(WARNING_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_WARNING} {...props} />);
    notificationManager.registerNotificationLayout(ERROR_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_ERROR} {...props} />);
    notificationManager.registerNotificationLayout(SUCCESS_LAYOUT_ID, props => <DefaultNotificationLayout styleType={STYLE_TYPE_SUCCESS} {...props} />);
    notificationManager.registerNotificationLayout(SEQUENCE_LAYOUT_ID, props => <SequenceNotificationLayout {...props} />);
}

export function terminate(notificationManager)
{
    notificationManager.clearNotifications();
}
