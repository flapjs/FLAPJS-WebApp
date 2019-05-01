import React from 'react';
import Style from './SplashView.css';

class SplashView extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            hide: props.hide
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick(e)
    {
        if (this.props.hideOnClick)
        {
            this.setState({hide: true});
        }
    }

    /** @override */
    render()
    {
        //const hideOnClick = this.props.hideOnClick;
        const hide = this.state.hide;
        return (
            <div id={this.props.id}
                className={Style.splash_container +
          (hide ? ' hide ' : '') +
          ' ' + this.props.className}
                style={this.props.style}
                onClick={this.onClick}>
                <div className={Style.splash_child}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default SplashView;
