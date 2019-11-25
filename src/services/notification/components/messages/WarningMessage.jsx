import React from 'react';
import PropTypes from 'prop-types';
import Style from './WarningMessage.module.css';
import DefaultMessageStyle from './DefaultMessage.module.css';

import LocaleString from '@flapjs/util/localization/LocaleString.jsx';

class WarningMessage extends React.Component
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
            <div className={DefaultMessageStyle.container + ' ' + Style.container}>
                {props.content &&
                    props.content.split('\n').map((e, i) =>
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
WarningMessage.propTypes = {
    children: PropTypes.node,
    notification: PropTypes.object.isRequired,
    content: PropTypes.string,
    onClose: PropTypes.func,
};
WarningMessage.defaultProps = {
    content: '',
};

export default WarningMessage;
