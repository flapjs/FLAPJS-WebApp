import React from 'react';
import PropTypes from 'prop-types';
import Style from './Workspace.module.css';

/**
 * A React component that can do anything you want. :D
 */
class Workspace extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            open: true,
            full: false,
            tabIndex: 0,
        };
        
        this.container = React.createRef();
        this.drawer = React.createRef();

        this.prevDrawerHandlePosition = { x: 0, y: 0 };
        this.onDrawerHandleDragBegin = this.onDrawerHandleDragBegin.bind(this);
        this.onDrawerHandleDragMove = this.onDrawerHandleDragMove.bind(this);
        this.onDrawerHandleDragEnd = this.onDrawerHandleDragEnd.bind(this);
    }

    onDrawerHandleDragBegin(e)
    {
        const drawerSize = this.drawer.current.getBoundingClientRect();
        this.prevDrawerHandlePosition.x = e.clientX + drawerSize.width;
        this.prevDrawerHandlePosition.y = e.clientY + drawerSize.height;

        document.addEventListener('mousemove', this.onDrawerHandleDragMove);
        document.addEventListener('mouseup', this.onDrawerHandleDragEnd);
    }

    onDrawerHandleDragMove(e)
    {
        const dx = this.prevDrawerHandlePosition.x - e.clientX;
        this.workspace.current.style.setProperty('--drawer-width', `${dx}px`);
    }

    onDrawerHandleDragEnd(e)
    {
        document.removeEventListener('mousemove', this.onDrawerHandleDragMove);
        document.removeEventListener('mouseup', this.onDrawerHandleDragEnd);
    }

    openDrawer(tabIndex = 0)
    {
        if (!this.state.open)
        {
            this.setState({ open: true, tabIndex });
        }
    }

    closeDrawer()
    {
        if (this.state.open)
        {
            this.setState({ open: false });
        }
    }

    toggleDrawer(tabIndex = 0)
    {
        this.setState(prev =>
        {
            return { open: !prev.open, tabIndex };
        });
    }

    /** @override */
    render()
    {
        const props = this.props;
        const open = this.state.open;

        const renderSideBar = props.renderSideBar;
        const renderViewport = props.renderViewport;
        const renderDrawer = props.renderDrawer;
        const renderForeground = props.renderForeground;
        const renderBackground = props.renderBackground;
        
        return (
            <section ref={this.container}
                className={Style.container + (props.className || '')}>
                <div className={Style.foreground}>
                    <nav className={Style.sidebar
                        + ' primary '}>
                        {renderSideBar && renderSideBar(this)}
                    </nav>
                    <div className={Style.viewport}>
                        {renderViewport && renderViewport(this)}
                    </div>
                    <div ref={this.drawer} className={Style.drawer + (open ? ' open ' : '')}>
                        <div className={Style.handle}
                            onMouseDown={this.onDrawerHandleDragBegin}
                            role="presentation">
                        </div>
                        <div className={Style.content}>
                            {renderDrawer && renderDrawer(this)}
                        </div>
                    </div>
                    <nav className={Style.sidebar
                        + ' secondary '}>
                        {renderSideBar && renderSideBar(this)}
                    </nav>
                    {renderForeground && renderForeground(this)}
                </div>
                <div className={Style.background}>
                    {renderBackground && renderBackground(this)}
                </div>
            </section>
        );
    }
}

Workspace.propTypes = {
    className: PropTypes.string,
    renderForeground: PropTypes.func,
    renderBackground: PropTypes.func,
    renderViewport: PropTypes.func,
    renderDrawer: PropTypes.func,
    renderSideBar: PropTypes.func,
};
Workspace.defaultProps = {
};

export default Workspace;
