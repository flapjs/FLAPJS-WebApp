import React from 'react';
import PropTypes from 'prop-types';
import Style from './ModeTrayWidget.module.css';

import IconButton from '@flapjs/components/icons/IconButton.jsx';
import { PencilIcon, MoveIcon } from '@flapjs/components/icons/Icons.js';

export const MODE_ACTION = 'action';
export const MODE_MOVE = 'move';

class ModeTrayWidget extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const props = this.props;

        const visible = props.visible;
        const value = props.value;
        const onChange = props.onChange;
        
        const hide = !visible;

        return (
            <div
                className={Style.container +
                    (hide ? ' hide' : '') +
                    ' ' + (props.className || '')}
                style={props.style}>
                <IconButton
                    className={(value === MODE_ACTION ? ' active' : '')}
                    onClick={() => onChange && onChange(MODE_ACTION)}
                    title={'cursor.actionmode'}
                    iconClass={PencilIcon} />
                <IconButton
                    className={(value === MODE_MOVE ? ' active' : '')}
                    onClick={() => onChange && onChange(MODE_MOVE)}
                    title={'cursor.movemode'}
                    iconClass={MoveIcon} />
            </div>
        );
    }
}
ModeTrayWidget.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    visible: PropTypes.bool,
    value: PropTypes.oneOf([ MODE_ACTION, MODE_MOVE ]),
    onChange: PropTypes.func,
};
ModeTrayWidget.defaultProps = {
    value: MODE_ACTION,
    visible: true,
};

export default ModeTrayWidget;
