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
                {context =>
                {
                    if (!props.children || props.children.length <= 0 || context.hasLocaleString(entity))
                    {
                        return context.getLocaleString(entity, ...params);
                    }
                    else
                    {
                        return props.children;
                    }
                }}
            </LocalizationConsumer>
        );
    }
}

LocaleString.propTypes = {
    children: PropTypes.string,
    entity: PropTypes.string.isRequired,
    params: PropTypes.arrayOf(PropTypes.string),
};
LocaleString.defaultProps = {
    params: []
};

export default LocaleString;
