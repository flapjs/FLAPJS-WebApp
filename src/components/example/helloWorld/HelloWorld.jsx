import React from 'react';
import PropTypes from 'prop-types';
import Style from './HelloWorld.module.css';

/**
 * A component to display 'Hello World!'. Once clicked, or if set by prop,
 * it will toggle between rainbow mode. Rainbow mode just changes the color
 * of the title to a rainbow.
 * 
 * Here's a tutorial on the effect: {@link https://w3bits.com/rainbow-text/}.
 */
class HelloWorld extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            rainbow: false
        };

        this.onClick = this.onClick.bind(this);
    }

    /**
     * Called when mouse clicks. Used as an event listener for 'click' event.
     *
     * @param {Event} e The mouse event.
     */
    onClick(e)
    {
        // Toggle rainbow
        this.setState(prev => ({ rainbow: !prev.rainbow }));

        if (this.props.onClick) this.props.onClick(e);
    }
    
    /** @override */
    render()
    {
        return (
            <button className={Style.helloWorld} onClick={this.onClick}>
                <h1 id={this.props.id}
                    style={this.props.style}
                    className={(this.props.className || '')
                        + Style.title
                        + ((this.state.rainbow || this.props.rainbow) ? ` ${Style.rainbow} ` : '')
                    }>
                    Hello {this.props.title}
                </h1>
            </button>
        );
    }
}

HelloWorld.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    
    title: PropTypes.string,
    rainbow: PropTypes.bool,
    onClick: PropTypes.func,
};
HelloWorld.defaultProps = {
    title: 'World!'
};

export default HelloWorld;
