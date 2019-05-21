import React from 'react';
import Style from './SpeechBubble.css';

class SpeechBubble extends React.Component
{
    constructor(props) { super(props); }

    /** @override */
    render()
    {
        const x = this.props.x;
        const y = this.props.y;

        return (
            <div {...this.props}
                className={Style.speech_container + ' upside '}
                style={{top: `${y}px`, left: `${x}px`}}>
                <div className={Style.speech_content}>
                </div>
            </div>
        );
    }
}

export default SpeechBubble;
