import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { RunningManIcon } from '@flapjs/components/icons/Icons.js';

function AboutTab(props)
{
    const { onClick, ...otherProps } = props;
    return (
        <IconButton key="0"
            onClick={onClick}
            iconClass={RunningManIcon}
            {...otherProps}/>
    );
}
AboutTab.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default AboutTab;
