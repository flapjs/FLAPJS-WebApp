import React from 'react';
import PropTypes from 'prop-types';
import Style from './IconButton.module.css';
import { LocalizationConsumer } from '@flapjs/util/localization/LocalizationContext.jsx';

class IconButton extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const { refButton, title, className, ...props } = this.props;
        const showButtonLabel = IconButton.SHOW_LABEL && title;

        return (
            <LocalizationConsumer>
                {context =>
                    <button {...props}
                        ref={refButton}
                        className={Style.icon_button +
                            (showButtonLabel ? ' hint ' : '') +
                            ' ' + className}
                        title={context.getLocaleString(title)}>
                        {this.props.children}
                        <label>{context.getLocaleString(title)}</label>
                    </button>
                }
            </LocalizationConsumer>
        );
    }
}
IconButton.SHOW_LABEL = false;
IconButton.propTypes = {
    //TODO: Fix types.
    refButton: PropTypes.any,
    title: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default IconButton;
