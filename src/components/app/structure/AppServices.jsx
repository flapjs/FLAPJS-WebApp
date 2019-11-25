import React from 'react';
import PropTypes from 'prop-types';

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
}
AppServices.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppServices;
