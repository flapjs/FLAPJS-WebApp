import React from 'react';
import PropTypes from 'prop-types';

import DeprecatedServiceProviders from '@flapjs/deprecated/DeprecatedServiceProviders.jsx';

import { ThemeProvider } from '@flapjs/components/theme/ThemeContext.jsx';
import { LocalizationProvider } from '@flapjs/util/localization/LocalizationContext.jsx';
import { DrawerProvider } from '@flapjs/components/drawer/context/DrawerContext.jsx';

class AppServices extends React.Component
{
    constructor(props)
    {
        super(props);
    }
    
    /** @override */
    render()
    {
        const props = this.props;

        const app = props.app;

        return (
            <LocalizationProvider localeCode="en">
                <ThemeProvider source={() => document.getElementById('root')}>
                    <DrawerProvider>
                        <DeprecatedServiceProviders app={app}>
                            {props.children}
                        </DeprecatedServiceProviders>
                    </DrawerProvider>
                </ThemeProvider>
            </LocalizationProvider>
        );
    }
}
AppServices.propTypes = {
    children: PropTypes.node.isRequired,
    app: PropTypes.object.isRequired,
};

export default AppServices;
