import React from 'react';
import Style from './DrawerView.css';

import IconButton from 'experimental/components/IconButton.js';
import ExpandDownIcon from 'components/iconset/ExpandDownIcon.js';

const DRAWER_WIDTH_CSSVAR = '--drawer-width';
const DRAWER_HANDLE_DRAG_OFFSET = 6;
const DRAWER_HANDLE_MIN_SIZE_BUFFER = 32;
const DRAWER_HANDLE_MAX_SIZE_BUFFER = 128;
const DRAWER_MIN_WIDTH = 200;
const DRAWER_RESIZE_REFRESH_RATE = 200;
const DRAWER_HANDLE_CUSTOM_SNAP_WIDTH = 300;

const DRAWER_SHOULD_HIDE_CONTENT_ON_RESIZE = true;
const DRAWER_SHOULD_HIDE_TAB_LIST = false;

export const DRAWER_WIDTH_TYPE_FULL = 'full';
export const DRAWER_WIDTH_TYPE_MIN = 'min';
export const DRAWER_SIDE_BOTTOM = 'bottom';
export const DRAWER_SIDE_RIGHT = 'right';
export const DRAWER_BAR_DIRECTION_VERTICAL = 'vertical';
export const DRAWER_BAR_DIRECTION_HORIZONTAL = 'horizontal';

/**
 * A component that renders a collapsible drawer. It also handles the viewport beside
 * the drawer. To update the panels available in the drawer, you can pass an array of
 * component classes through the props.
 * 
 * TODO: The drawer should not be responsible for the viewport as well. Separation of concerns.
 */
class DrawerView extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = null;
        this.drawerElement = null;

        this.state = {
            open: false,
            tabIndex: 0,
            soloClass: null,
            viewportColor: null
        };

        //When drawer is currently changing size intentfully
        this._handlingGrab = false;
        this._handlingResize = false;
        //Whether the drawer should fullscreen
        this._isfull = false;
        //Whether to restore drawer width after fullscreen
        this._hasintent = false;
        //Save intentful drawer width for restore after fullscreen
        this._prevWidth = DRAWER_MIN_WIDTH;
        //Used to manage resize updates
        this._resizeTimeout = null;
        this._resizeEndTimeout = null;
        //Changed in render() to reflect current render state.
        this._sideways = false;

        this.onDrawerHandleGrab = this.onDrawerHandleGrab.bind(this);
        this.onDrawerHandleRelease = this.onDrawerHandleRelease.bind(this);
        this.onDrawerHandleMove = this.onDrawerHandleMove.bind(this);
        this.onDrawerExpand = this.onDrawerExpand.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    /** @override */
    componentDidMount()
    {
        window.addEventListener('resize', this.onWindowResize, false);
    }

    /** @override */
    componentWillUnmount()
    {
        window.removeEventListener('resize', this.onWindowResize);
    }

    openDrawer(fullscreen = false, callback = null)
    {
        if (fullscreen)
        {
            this.setDrawerWidth(DRAWER_WIDTH_TYPE_FULL, true);
        }

        if (!this.state.open)
        {
            this.setState({ open: true }, callback);
        }
    }

    closeDrawer(callback = null)
    {
        if (this.state.open)
        {
            this.setState({ open: false }, callback);
        }
    }

    toggleDrawer(callback = null)
    {
        this.setState((prev, props) => 
        {
            return { open: !prev.open };
        }, callback);
    }

    isDrawerOpen()
    {
        return this.state.open;
    }

    isDrawerFullscreen()
    {
        return this._isfull;
    }

    setCurrentTab(tabIndex)
    {
        if (!this.props.panels) return;
        if (tabIndex >= this.props.panels.length) tabIndex = 0;
        if (this.state.open && this.state.tabIndex === tabIndex)
        {
            //Toggle fullscreen
            if (this._isfull)
            {
                this.setDrawerWidth(this._prevWidth);
            }
            else
            {
                this.setDrawerWidth(DRAWER_WIDTH_TYPE_FULL, true);
            }
        }
        else
        {
            //Open and set tab index
            this.setState({ open: true, tabIndex: tabIndex });
        }
    }

    getCurrentTabIndex()
    {
        return this.state.tabIndex;
    }

    isCurrentTab(tabIndex)
    {
        return this.state.tabIndex === tabIndex;
    }

    /** Sets the viewport boundary color */
    setViewportColor(color)
    {
        this.setState({ viewportColor: color });
    }
    
    /** Gets the viewport boundary color */
    getViewportColor()
    {
        return this.state.viewportColor;
    }

    setDrawerSoloClass(soloClass, callback = null)
    {
        this.setState({ soloClass: soloClass }, callback);
    }

    setDrawerWidth(value, hasIntent = true)
    {
        if (!this.drawerElement || !this.ref) return;

        this._hasintent = hasIntent;

        const drawerSide = this.props.side;
        const drawerOffsetY = this.ref.getBoundingClientRect().top;
        const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
        const documentSize = isDrawerSideBottom ?
            document.documentElement.clientHeight - drawerOffsetY :
            document.documentElement.clientWidth;
        const minSize = DRAWER_MIN_WIDTH;

        if (typeof value === 'string')
        {
            switch (value)
            {
            case DRAWER_WIDTH_TYPE_FULL:
                this._isfull = true;
                this._prevWidth = getCSSDrawerWidth(this.drawerElement);
                break;
            case DRAWER_WIDTH_TYPE_MIN:
                this._isfull = false;
                this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, minSize + 'px');
                break;
            default:
                throw new Error('Trying to set drawer width to invalid string');
            }
        }
        else if (typeof value === 'number')
        {
            if (value < minSize + DRAWER_HANDLE_MIN_SIZE_BUFFER) value = minSize;
            if (value > documentSize - DRAWER_HANDLE_MAX_SIZE_BUFFER)
            {
                value = documentSize;
                this._isfull = true;
            }
            else
            {
                this._isfull = false;
            }
            this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, value + 'px');
        }
        else
        {
            throw new Error('Trying to set drawer width to unknown value');
        }
    }

    onDrawerExpand()
    {
        //Don't close, just small-ify.
        if (this.state.open && this._isfull)
        {
            this.setDrawerWidth(this._prevWidth);

            //If did not make any changes...
            if (this._isfull)
            {
                //Make it do normal stuff.
                this.toggleDrawer();
            }
        }
        else
        {
            this.toggleDrawer();
        }
    }

    onWindowResize(e)
    {
        if (!this._resizeTimeout)
        {
            this._resizeTimeout = setTimeout(() => 
            {
                this._resizeTimeout = null;

                //Handle resize ends (more like debouncing)
                if (this._resizeEndTimeout) clearTimeout(this._resizeEndTimeout);
                else this._handlingResize = true;
                this._resizeEndTimeout = setTimeout(() => 
                {
                    this._resizeEndTimeout = null;
                    this._handlingResize = false;
                }, 500);

                if (!this.drawerElement || !this.ref) return;

                const drawerSide = this.props.side;
                const drawerOffsetY = this.ref.getBoundingClientRect().top;
                const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
                const documentSize = isDrawerSideBottom ?
                    document.documentElement.clientHeight - drawerOffsetY :
                    document.documentElement.clientWidth;

                if (this._isfull)
                {
                    if (this._hasintent) return;
                    if (this._prevWidth + DRAWER_HANDLE_MAX_SIZE_BUFFER < documentSize)
                    {
                        this._isfull = false;
                        this.drawerElement.style.setProperty(DRAWER_WIDTH_CSSVAR, this._prevWidth + 'px');
                    }
                }
                else
                {
                    const drawerSize = getCSSDrawerWidth(this.drawerElement);
                    if (drawerSize + DRAWER_HANDLE_MAX_SIZE_BUFFER > documentSize)
                    {
                        this._isfull = true;
                        this._hasintent = false;
                    }
                }
            }, DRAWER_RESIZE_REFRESH_RATE);
        }
    }

    onDrawerHandleGrab(e)
    {
        if (!this._handlingGrab && this.state.open)
        {
            this._handlingGrab = true;
            this._prevWidth = getCSSDrawerWidth(this.drawerElement);
            document.addEventListener('mouseup', this.onDrawerHandleRelease);
            document.addEventListener('mousemove', this.onDrawerHandleMove);
        }
        else
        {
            this.onDrawerHandleRelease(e);
        }
    }

    onDrawerHandleRelease(e)
    {
        if (this._handlingGrab)
        {
            document.removeEventListener('mouseup', this.onDrawerHandleRelease);
            document.removeEventListener('mousemove', this.onDrawerHandleMove);
            this._handlingGrab = false;
            this._prevWidth = getCSSDrawerWidth(this.drawerElement);
        }
    }

    onDrawerHandleMove(e)
    {
        const drawerSide = this.props.side;
        const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
        const documentSize = isDrawerSideBottom ?
            document.documentElement.clientHeight :
            document.documentElement.clientWidth;
        const pointerValue = isDrawerSideBottom ? e.clientY : e.clientX;

        let result = documentSize - pointerValue + DRAWER_HANDLE_DRAG_OFFSET;
        //Try snapping to some widths...
        if (!isDrawerSideBottom && Math.abs(result - DRAWER_HANDLE_CUSTOM_SNAP_WIDTH) < DRAWER_HANDLE_MIN_SIZE_BUFFER)
        {
            result = DRAWER_HANDLE_CUSTOM_SNAP_WIDTH;
        }
        this.setDrawerWidth(result);
    }

    /** @override */
    render()
    {
        const drawerPanels = this.props.panels;
        const drawerSide = this.props.side || DRAWER_SIDE_RIGHT;
        const drawerDirection = this.props.direction || DRAWER_BAR_DIRECTION_HORIZONTAL;
        const shouldDrawerHide = this.props.hide || false;
        const drawerSoloClass = this.state.soloClass;

        const isDrawerOpen = this.state.open;
        //Assumes that parent container has flex and flex-direction: column for bottom, row for right.
        const isDrawerSideBottom = drawerSide === DRAWER_SIDE_BOTTOM;
        const shouldDrawerBarSideways = !isDrawerSideBottom && (!isDrawerOpen || drawerDirection === DRAWER_BAR_DIRECTION_VERTICAL);
        const showDrawerHandle = isDrawerOpen || this._handlingGrab;
        const shouldDrawerOpenFull = this._isfull;
        const shouldHideDrawerContent = (DRAWER_SHOULD_HIDE_CONTENT_ON_RESIZE && (this._handlingGrab || this._handlingResize)) || !isDrawerOpen;
        const showDrawerTabs = isDrawerOpen || !DRAWER_SHOULD_HIDE_TAB_LIST;

        //Used to handle sideways logic
        this._sideways = shouldDrawerBarSideways;

        let viewportStyle = {};
        if (this.state.viewportColor !== null)
        {
            viewportStyle['outlineColor'] = this.state.viewportColor;
        }

        return (
            <div ref={ref => this.ref = ref}
                id={this.props.id}
                className={Style.app_content +
                    (isDrawerSideBottom ? ' column ' : '') +
                    (' ' + this.props.className)}
                style={this.props.style}>
                <div className={Style.app_viewport} style={viewportStyle}>
                    {this.props.children}
                </div>
                <div ref={ref => this.drawerElement = ref}
                    className={
                        Style.app_drawer +
                        (isDrawerOpen ? ' open ' : '') +
                        (shouldDrawerBarSideways ? ' drawer-bar-sideways ' : '') +
                        (isDrawerSideBottom ? ' drawer-side-bottom ' : '') +
                        (shouldDrawerOpenFull ? ' full ' : '') +
                        (shouldHideDrawerContent ? ' hide-content ' : '') +
                        (this._handlingResize ? ' no-animation ' : '') +
                        (shouldDrawerHide ? ' hide ' : '')}>
                    <div className={Style.drawer_handle + (showDrawerHandle ? ' show ' : '')} onMouseDown={this.onDrawerHandleGrab}>
                        <span>{'||'}</span>
                    </div>
                    <div className={Style.drawer_content}>
                        <nav className={Style.drawer_content_bar}>
                            <IconButton className={Style.drawer_tab_expander} onClick={this.onDrawerExpand}>
                                <ExpandDownIcon />
                            </IconButton>
                            {showDrawerTabs && drawerPanels && drawerPanels.map((e, i) => 
                            {
                                if (!e) return null;
                                if (!e['TITLE']) return null;
                                const title = e['TITLE'];
                                const current = this.isCurrentTab(i);
                                const disabled = drawerSoloClass && drawerSoloClass !== e;
                                return (
                                    <a key={title + ':' + i}
                                        className={Style.drawer_tab +
                                            (current ? ' active ' : '') +
                                            (disabled ? ' disabled ' : '')}
                                        onClick={() => this.setCurrentTab(i)}>
                                        <label>{title}</label>
                                    </a>
                                );
                            })}
                        </nav>
                        <div className={Style.drawer_content_panel_container}>
                            <div className={Style.drawer_content_panel}>
                                {drawerPanels && drawerPanels.map((e, i) => 
                                {
                                    if (!e) return null;
                                    const ComponentClass = e;
                                    const title = e['TITLE'] || '';
                                    const current = this.isCurrentTab(i);
                                    const disabled = drawerSoloClass && drawerSoloClass !== e;
                                    return (
                                        <div key={title + ':' + i}
                                            className={Style.drawer_panel_container +
                                                (!current ? ' hide ' : '') +
                                                (disabled ? ' disabled ' : '')}>
                                            <ComponentClass className={Style.drawer_panel}
                                                {...this.props.panelProps}
                                                drawer={this} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default DrawerView;

function getCSSDrawerWidth(drawerElement)
{
    return parseInt(window.getComputedStyle(drawerElement).getPropertyValue(DRAWER_WIDTH_CSSVAR).replace(/\D/g, ''));
}
