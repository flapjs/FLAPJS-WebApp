import React from 'react';
import PropTypes from 'prop-types';

import { NotificationProvider } from '@flapjs/deprecated/notification/NotificationContext.jsx';

function DeprecatedServiceProviders(props)
{
    const app = props.app;

    return (
        <NotificationProvider manager={app._notificationManager}>
            {props.children}
        </NotificationProvider>
    );
}
DeprecatedServiceProviders.propTypes = {
    children: PropTypes.node,
    //TODO: Get a propr type.
    app: PropTypes.any,
};

export default DeprecatedServiceProviders;
