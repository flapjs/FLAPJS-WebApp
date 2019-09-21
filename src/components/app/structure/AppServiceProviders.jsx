import React from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '../../theme/ThemeContext.jsx';
import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import { DrawerProvider } from '@flapjs/contexts/drawer/DrawerContext.jsx';

function AppServiceProviders(props)
{
    // NOTE: Add any additional global service providers here.
    return (
        <LocalizationProvider localeCode="en">
            <ThemeProvider source={() => document.getElementById('root')}>
                <DrawerProvider>
                    {props.children}
                </DrawerProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
}
AppServiceProviders.propTypes = {
    children: PropTypes.node,
};

export default AppServiceProviders;
