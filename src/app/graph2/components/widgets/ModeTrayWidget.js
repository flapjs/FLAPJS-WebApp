import React from 'react';
import Style from './ModeTrayWidget.css';

import IconButton from 'experimental/components/IconButton.js';
import EditPencilIcon from 'components/iconset/EditPencilIcon.js';
import MoveIcon from 'components/iconset/MoveIcon.js';

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
                <IconButton className={Style.tray_button +
                    (mode === MODE_ACTION ? ' active ' : '')}
                onClick={() => 
                {
                    if (onChange) onChange(MODE_ACTION);
                }}
                title={I18N.toString('cursor.actionmode')}>
                    <EditPencilIcon />
                </IconButton>
                <IconButton className={Style.tray_button +
                    (mode === MODE_MOVE ? ' active ' : '')}
                onClick={() => 
                {
                    if (onChange) onChange(MODE_MOVE);
                }}
                title={I18N.toString('cursor.movemode')}>
                    <MoveIcon />
                </IconButton>
            </div>
        );
    }
}
export default ModeTrayWidget;
