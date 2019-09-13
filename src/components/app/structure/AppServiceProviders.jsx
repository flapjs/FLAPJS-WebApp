import React from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '../../theme/ThemeContext.jsx';
import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';

import { NotificationProvider } from '@flapjs/deprecated/notification/NotificationContext.jsx';

function AppServiceProviders(props)
{
    const app = props.app;

    return (
        <LocalizationProvider localeCode="en">
            <ThemeProvider source={() => document.getElementById('root')}>
                <NotificationProvider manager={app.getNotificationManager()}>
                    {props.children}
                </NotificationProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
}
AppServiceProviders.propTypes = {
    children: PropTypes.node,
    //TODO: Get a propr type.
    app: PropTypes.any,
};

export default AppServiceProviders;
