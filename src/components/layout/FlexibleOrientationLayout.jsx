import React from 'react';
import PropTypes from 'prop-types';
import Style from './FlexibleOrientationLayout.module.css';

/**
 * A React component that takes a function as its child and
 * orientate itself on resize based on the passed-in media query.
 */
class FlexibleOrientationLayout extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            orientation: 'row',
            resize: false,
        };
        
        //Used to manage resize updates
        this._resizeTimeout = null;

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

    onWindowResize(e)
    {
        if (!this._resizeTimeout)
        {
            if (!this.state.resize) this.setState({ resize: true });
            this._resizeTimeout = setTimeout(() =>
            {
                this._resizeTimeout = null;
                if (this.state.resize) this.setState({ resize: false });
            },
            this.props.resizeDelay);
        }

        if (window.matchMedia(this.props.resizeMediaQuery).matches)
        {
            if (this.state.orientation !== 'column')
            {
                this.setState({ orientation: 'column' });
            }
        }
        else
        {
            if (this.state.orientation !== 'row')
            {
                this.setState({ orientation: 'row' });
            }
        }
    }

    /** @override */
    render()
    {
        const props = this.props;
        const state = this.state;

        return (
            <div className={Style.container
                + (props.className || '')
                + (state.resize ? ' resizing' : '')}>
                {props.children.call(null, state.orientation)}
            </div>
        );
    }
}

FlexibleOrientationLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.func.isRequired,
    resizeMediaQuery: PropTypes.string,
    resizeDelay: PropTypes.number,
};
FlexibleOrientationLayout.defaultProps = {
    resizeMediaQuery: '(max-width: 500px)',
    resizeDelay: 300,
};

export default FlexibleOrientationLayout;
