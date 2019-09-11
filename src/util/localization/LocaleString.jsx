import React from 'react';
import PropTypes from 'prop-types';

import { LocalizationConsumer } from './LocalizationContext.jsx';

/**
 * A React component to translate that locale entity name for you.
 */
class LocaleString extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;
        const entity = props.entity;
        const params = props.params;

        return (
            <LocalizationConsumer>
                {context => context.getLocaleString(entity, ...params)}
            </LocalizationConsumer>
        );
    }
}

LocaleString.propTypes = {
    entity: PropTypes.string.isRequired,
    params: PropTypes.arrayOf(PropTypes.string),
};
LocaleString.defaultProps = {
    params: []
};

export default LocaleString;
