import React from 'react';
import Style from './FullscreenWidget.css';

import IconStateButton from 'experimental/components/IconStateButton.js';
import FullscreenIcon from 'components/iconset/FullscreenIcon.js';
import FullscreenExitIcon from 'components/iconset/FullscreenExitIcon.js';

class FullscreenWidget extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        const app = this.props.app;

        return (
            <IconStateButton id={this.props.id}
                className={Style.fullscreen_button + ' ' + this.props.className}
                style={this.props.style}
                title={'Fullscreen Mode'}
                onClick={(e, i) => app.setState({hide: (i === 0)})}>
                <FullscreenIcon/>
                <FullscreenExitIcon/>
            </IconStateButton>
        );
    }
}

export default FullscreenWidget;
