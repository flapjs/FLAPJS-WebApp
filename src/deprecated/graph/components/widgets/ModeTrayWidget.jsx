import React from 'react';
import PropTypes from 'prop-types';
import Style from './ModeTrayWidget.module.css';

import IconButton from '../../../icon/IconButton.jsx';
import { PencilIcon, MoveIcon } from '@flapjs/components/icons/Icons.js';

export const MODE_ACTION = 0;
export const MODE_MOVE = 1;

class ModeTrayWidget extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const visible = this.props.visible;
        const mode = this.props.mode;
        const onChange = this.props.onChange;
        const hide = !visible;

        return (
            <div id={this.props.id}
                className={Style.tray_container +
                    (hide ? ' hide ' : '') +
                    ' ' + this.props.className}
                style={this.props.style}>
                <IconButton
                    className={Style.tray_button
                        + (mode === MODE_ACTION ? ' active ' : '')}
                    onClick={() => 
                    {
                        if (onChange) onChange(MODE_ACTION);
                    }}
                    title={'cursor.actionmode'}>
                    <PencilIcon />
                </IconButton>
                <IconButton
                    className={Style.tray_button
                        + (mode === MODE_MOVE ? ' active ' : '')}
                    onClick={() => 
                    {
                        if (onChange) onChange(MODE_MOVE);
                    }}
                    title={'cursor.movemode'}>
                    <MoveIcon />
                </IconButton>
            </div>
        );
    }
}
ModeTrayWidget.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    // TODO: fix type.
    mode: PropTypes.any,
    visible: PropTypes.bool,
    onChange: PropTypes.func,
};

export default ModeTrayWidget;
