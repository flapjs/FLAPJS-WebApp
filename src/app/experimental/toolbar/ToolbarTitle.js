import React from 'react';
import Style from './ToolbarTitle.css';

import FormattedInput from 'deprecated/system/formattedinput/FormattedInput.js';
import OfflineIcon from 'components/iconset/OfflineIcon.js';

class ToolbarTitle extends React.Component
{
    constructor(props)
    {
        super(props);

        this.inputElement = null;

        this.onSubmit = this.onSubmit.bind(this);
    }

    setTitle(title)
    {
        this.inputElement.resetValue(title);
    }

    getTitle()
    {
        return this.inputElement.value;
    }

    onSubmit(newValue, prevValue)
    {
        //If the value has changed or the value remained empty...
        if (newValue !== prevValue)
        {
            if (this.props.onChange) this.props.onChange(newValue);
        }
    }

    /** @override */
    render()
    {
        const title = this.props.title;
        const SubtitleClass = this.props.subtitle;
        const offline = !(navigator && navigator.onLine);
        const onClick = this.props.onClick;

        return (
            <div id={this.props.id}
                className={Style.title_container +
                    ' ' + this.props.className}
                style={this.props.style}>
                <span className={Style.title_input_container}>
                    <FormattedInput ref={ref => this.inputElement = ref}
                        defaultValue={this.props.defaultValue}
                        onSubmit={this.onSubmit} />
                    {offline && <OfflineIcon className={Style.offline_status} />}
                </span>
                <div className={Style.title_label} onClick={onClick}>
                    {title}
                    {SubtitleClass &&
                        <span className={Style.title_subtitle} onClick={e => e.stopPropagation()}>
                            <SubtitleClass />
                        </span>}
                </div>
            </div>
        );
    }
}

export default ToolbarTitle;
