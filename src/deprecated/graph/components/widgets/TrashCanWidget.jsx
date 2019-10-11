import React from 'react';
import PropTypes from 'prop-types';
import Style from './TrashCanWidget.module.css';

import ControlledIconButton from '@flapjs/components/icons/ControlledIconButton.jsx';
import { TrashCanDetailedIcon } from '@flapjs/components/icons/Icons.js';

const DOUBLE_TAP_TIME = 250;

class TrashCanWidget extends React.Component
{
    constructor(props)
    {
        super(props);

        this._buttonElement = React.createRef();

        this.state = {
            active: false,
            forceActive: false
        };

        this._doubleTapTimeout = null;

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);

        // This is kinda a hack to lose trash mode focus...
        this.onAnyMouseDownNotConsumed = this.onAnyMouseDownNotConsumed.bind(this);
    }

    onMouseEnter(e)
    {
        if (this.state.forceActive) return;

        this.setState({ active: true }, () =>
        {
            const onChange = this.props.onChange;
            if (onChange) onChange(true);
        });
    }

    onMouseLeave(e)
    {
        if (this.state.forceActive) return;

        this.setState({ active: false }, () =>
        {
            const onChange = this.props.onChange;
            if (onChange) onChange(false);
        });
    }

    onClick(e)
    {
        e.stopPropagation();
        e.preventDefault();

        if (this._doubleTapTimeout)
        {
            // This is a double tap!
            clearTimeout(this._doubleTapTimeout);
            this._doubleTapTimeout = null;

            this.setState({ active: false, forceActive: false }, () =>
            {
                const onClear = this.props.onClear;
                if (onClear) onClear();
                const onChange = this.props.onChange;
                if (onChange) onChange(false);
            });
        }
        else
        {
            // This is a single tap!
            this.setState((prev, props) =>
            {
                const result = !prev.forceActive;

                this._doubleTapTimeout = setTimeout(() =>
                {
                    this._doubleTapTimeout = null;
                }, DOUBLE_TAP_TIME);

                if (result)
                {
                    document.documentElement.addEventListener('mousedown', this.onAnyMouseDownNotConsumed);
                }

                return {
                    active: result,
                    forceActive: result
                };
            }, () =>
            {
                const onChange = this.props.onChange;
                if (onChange) onChange(this.state.active);
            });
        }
    }

    onAnyMouseDownNotConsumed(e)
    {
        if (this.state.forceActive && this._buttonElement.current !== e.target)
        {
            e.stopPropagation();
            e.preventDefault();

            document.documentElement.removeEventListener('mousedown', this.onAnyMouseDownNotConsumed);
            
            this.setState({ active: false, forceActive: false }, () =>
            {
                const onChange = this.props.onChange;
                if (onChange) onChange(false);
            });
        }
    }

    /** @override */
    render()
    {
        const props = this.props;
        const visible = props.visible;
        
        const active = this.state.active;
        const hide = !active && !visible;

        return (
            <ControlledIconButton
                className={Style.trash_container +
                    (active ? ' active ' : '') +
                    (hide ? ' hide ' : '') +
                    ' ' + this.props.className}
                style={props.style}
                title={'Delete'}
                elementRef={this._buttonElement}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onClick}
                iconClass={TrashCanDetailedIcon} />
        );
    }
}
TrashCanWidget.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    visible: PropTypes.bool,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
};
TrashCanWidget.defaultProps = {
    visible: true
};

export default TrashCanWidget;
