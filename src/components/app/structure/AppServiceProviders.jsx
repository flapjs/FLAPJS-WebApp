import React from 'react';
import PropTypes from 'prop-types';

import { ThemeProvider } from '../../theme/ThemeContext.jsx';
import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';

function AppServiceProviders(props)
{
    // NOTE: Add any additional global service providers here.
    return (
        <LocalizationProvider localeCode="en">
            <ThemeProvider source={() => document.getElementById('root')}>
                {props.children}
            </ThemeProvider>
        </LocalizationProvider>
    );
}
AppServiceProviders.propTypes = {
    children: PropTypes.node,
};

export default AppServiceProviders;
