import React from 'react';
import PropTypes from 'prop-types';
import Style from './DrawerLayout.module.css';

// Out of 100%
const INITIAL_DRAWER_SIZE = 30;

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
            // The size of the drawer, out of 100.
            size: INITIAL_DRAWER_SIZE,
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
        const side = this.props.side;
        const snapPoints = this.props.snapPoints;
        const snapBehavior = this.props.snapBehavior;
        const size = this.state.size;
        const boundingRect = this.container.current.getBoundingClientRect();

        let value;
        switch(side)
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

        // Make sure it is within range
        value = Math.min(Math.max(0, value * 100), 100);

        // Apply snap points
        switch(snapBehavior)
        {
            case 'nearest':
                value = applySnapPointsNearest(value, snapPoints);
                break;
            case 'range': {
                const horizontal = side === 'left' || side === 'right';
                value = applySnapPointsWithinRange(value, snapPoints, horizontal ? boundingRect.width : boundingRect.height, 30);
                break;
            }
            default:
                throw new Error(`Invalid snap behavior '${snapBehavior}'.`);
        }

        // Only update if it is a significant change
        if (Math.abs(size - value) > 0.1)
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

        const containerStyle = {
            flexDirection: containerFlexDirection
        };

        return (
            <div ref={this.container}
                className={Style.container}
                style={containerStyle}>
                <div
                    className={Style.drawer
                        + ' ' + (props.className || '')
                        + ' ' + side
                        + (open ? ' open' : '')}
                    style={drawerStyle}>
                    <div className={Style.handle}
                        role="presentation"
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

function applySnapPointsWithinRange(value, snapPoints, maxValue = 100, range = 15)
{
    for(const snapPoint of snapPoints)
    {
        if ((Math.abs(value - snapPoint) * 0.01) * maxValue < range)
        {
            return snapPoint;
        }
    }
    return value;
}

function applySnapPointsNearest(value, snapPoints)
{
    let minValue = value;
    let minDistance = Infinity;
    let distance;
    for(const snapPoint of snapPoints)
    {
        distance = Math.abs(value - snapPoint);
        if (distance < minDistance)
        {
            minDistance = distance;
            minValue = snapPoint;
        }
    }
    return minValue;
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
    snapPoints: PropTypes.arrayOf(PropTypes.number),
    snapBehavior: PropTypes.oneOf([
        'nearest',
        'range',
    ]),
};
DrawerLayout.defaultProps = {
    side: 'left',
    open: true,
    snapPoints: [INITIAL_DRAWER_SIZE, 50, 100],
    snapBehavior: 'range',
};

export default DrawerLayout;
