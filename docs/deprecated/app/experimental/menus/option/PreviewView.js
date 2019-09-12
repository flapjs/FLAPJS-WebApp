import React from 'react';
import Style from './PreviewView.css';

class PreviewView extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /** @override */
    render()
    {
        return (
            <div id={this.props.id}
                className={Style.preview_container +
          ' ' + this.props.className}
                style={this.props.style}>
                <div className={Style.preview_app}>
                    <div className={Style.preview_toolbar}>
                    </div>
                    <div className={Style.preview_workspace}>
                        <div className={Style.preview_viewport}>
                            <div className={Style.preview_node} style={{left: '25%', top: '40%'}}></div>
                            <div className={Style.preview_node} style={{left: '40%', top: '40%'}}></div>
                        </div>
                        <div className={Style.preview_notifications}>
                            <div className={Style.preview_notification_info}></div>
                            <div className={Style.preview_notification_error}></div>
                            <div className={Style.preview_notification_warning}></div>
                            <div className={Style.preview_notification_success}></div>
                        </div>
                        <div className={Style.preview_drawer}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PreviewView;
