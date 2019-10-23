import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { RunningManIcon } from '@flapjs/components/icons/Icons.js';

function ExportTab(props)
{
    const { onClick, ...otherProps } = props;
    return (
        <IconButton
            onClick={onClick}
            iconClass={RunningManIcon}
            {...otherProps}/>
    );
}
ExportTab.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default ExportTab;
