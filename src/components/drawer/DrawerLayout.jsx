import React from 'react';
import PropTypes from 'prop-types';
import Style from './DrawerLayout.module.css';

/**
 * A React component that adds a collapsible and flexible
 * drawer with a viewport. It uses render props to delegate
 * rendering outside itself, therefore separation of concerns!
 */
class DrawerLayout extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            size: 100,
        };

        this.container = React.createRef();

        this.onDrawerHandleDragBegin = this.onDrawerHandleDragBegin.bind(this);
        this.onDrawerHandleDragMove = this.onDrawerHandleDragMove.bind(this);
        this.onDrawerHandleDragEnd = this.onDrawerHandleDragEnd.bind(this);
    }

    onDrawerHandleDragBegin(e)
    {
        document.addEventListener('mousemove', this.onDrawerHandleDragMove);
        document.addEventListener('mouseup', this.onDrawerHandleDragEnd);
    }

    onDrawerHandleDragMove(e)
    {
        const boundingRect = this.container.current.getBoundingClientRect();

        let value;
        switch(this.props.side)
        {
            case 'left':
                value = (e.clientX - boundingRect.left) / boundingRect.width;
                break;
            case 'right':
                value = -(e.clientX - boundingRect.right) / boundingRect.width;
                break;
            case 'top':
                value = (e.clientY - boundingRect.top) / boundingRect.height;
                break;
            case 'bottom':
                value = -(e.clientY - boundingRect.bottom) / boundingRect.height;
                break;
            default:
                throw new Error('Invalid drawer side for layout');
        }

        value = Math.min(Math.max(0, value * 100), 100);
        if (Math.abs(this.state.size - value) > 0.1)
        {
            this.setState({ size: value });
        }
    }

    onDrawerHandleDragEnd(e)
    {
        document.removeEventListener('mousemove', this.onDrawerHandleDragMove);
        document.removeEventListener('mouseup', this.onDrawerHandleDragEnd);
    }

    /** @override */
    render()
    {
        const props = this.props;
        const state = this.state;

        const side = props.side;
        const size = state.size;
        const open = props.open;

        const horizontal = side === 'left' || side === 'right';

        const drawerStyle = {
            width: horizontal ? `${size}%` : '100%',
            height: !horizontal ? `${size}%` : '100%',
        };
        
        const containerFlexDirection = (
            side === 'left' ? 'row' :
                side === 'right' ? 'row-reverse' :
                    side === 'top' ? 'column' :
                        'column-reverse'
        );

        return (
            <div ref={this.container} className={Style.container}
                style={{ flexDirection: containerFlexDirection }}>
                <div
                    className={
                        Style.drawer
                        + ' ' + (props.className || '')
                        + ' ' + side
                        + (open ? ' open' : '')
                    }
                    style={drawerStyle}>
                    <div className={Style.handle} role="presentation"
                        onMouseDown={this.onDrawerHandleDragBegin}>
                    </div>
                    <div className={Style.content}>
                        {props.renderDrawer && props.renderDrawer(this)}
                    </div>
                </div>
                <div className={Style.viewport}>
                    {props.children}
                </div>
            </div>
        );
    }
}

DrawerLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    open: PropTypes.bool,
    side: PropTypes.oneOf([
        'left',
        'right',
        'top',
        'bottom',
    ]),
    renderDrawer: PropTypes.func,
    renderViewport: PropTypes.func,
};
DrawerLayout.defaultProps = {
    side: 'left',
    open: true,
};

export default DrawerLayout;
