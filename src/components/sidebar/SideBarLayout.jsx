import React from 'react';
import PropTypes from 'prop-types';
import Style from './SideBarLayout.module.css';

/**
 * A React component that adds a sidebar with a viewport.
 */
class SideBarLayout extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const props = this.props;

        const side = props.side;
        
        const horizontal = side === 'left' || side === 'right';

        const containerFlexDirection = (
            side === 'left' ? 'row' :
                side === 'right' ? 'row-reverse' :
                    side === 'top' ? 'column' :
                        'column-reverse'
        );
        
        return (
            <div className={Style.container + ' ' + (props.className || '')} style={{ flexDirection: containerFlexDirection }}>
                <div className={Style.sidebar + ' ' + side}>
                    {props.renderSideBar && props.renderSideBar(this, horizontal)}
                </div>
                <div className={Style.viewport}>
                    {props.children}
                </div>
            </div>
        );
    }
}

SideBarLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    renderSideBar: PropTypes.func,
    side: PropTypes.oneOf([
        'left',
        'right',
        'top',
        'bottom',
    ]),
};
SideBarLayout.defaultProps = {
    side: 'left',
};

export default SideBarLayout;
