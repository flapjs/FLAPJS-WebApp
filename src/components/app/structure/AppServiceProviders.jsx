import React from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '@flapjs/components/theme/ThemeContext.jsx';
import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import { DrawerProvider } from '@flapjs/contexts/drawer/DrawerContext.jsx';
import { SessionProvider } from '@flapjs/contexts/session/SessionContext.jsx';

function AppServiceProviders(props)
{
    // NOTE: Add any additional global service providers here.
    return (
        <SessionProvider session={props.appProps.session}>
            <LocalizationProvider localeCode="en">
                <ThemeProvider source={() => document.getElementById('root')}>
                    <DrawerProvider>
                        {props.children}
                    </DrawerProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </SessionProvider>
    );
}
AppServiceProviders.propTypes = {
    children: PropTypes.node,
    appProps: PropTypes.object,
};

export default AppServiceProviders;
