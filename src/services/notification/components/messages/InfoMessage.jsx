import React from 'react';
import PropTypes from 'prop-types';
import Style from './InfoMessage.module.css';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';

class InfoMessage extends React.Component
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
            <div className={Style.container}>
                {props.textContent &&
                    props.textContent.split('\n').map((e, i) =>
                        <p key={e + ':' + i}>
                            {e}
                        </p>
                    )}
                {props.children}
                {props.notification &&
                    <button onClick={e => props.onClose && props.onClose(props.notification)}>
                        <LocaleString entity="message.action.close" />
                    </button>}
            </div>
        );
    }
}
InfoMessage.propTypes = {
    children: PropTypes.node,
    notification: PropTypes.object.isRequired,
    textContent: PropTypes.string,
    onClose: PropTypes.func,
};
InfoMessage.defaultProps = {
    textContent: '',
};

export default InfoMessage;
