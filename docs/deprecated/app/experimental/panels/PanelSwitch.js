import React from 'react';
import Style from './PanelSwitch.css';

class PanelSwitch extends React.Component
{
    constructor(props)
    {
        super(props);

        if (!props.id) throw new Error('Must specify id');
    }

    /** @override */
    render()
    {
        const id = this.props.id;
        const disabled = this.props.disabled;
        const checked = this.props.checked;
        const onChange = this.props.onChange;

        return (
            <div id={id}
                className={Style.switch_container +
                    (disabled ? ' disabled ' : '') +
                    (checked ? ' active ' : '') +
                    ' ' + this.props.className}
                style={this.props.style}>
                <label className={Style.panel_switch}
                    style={this.props.style}>
                    <input type="checkbox" id={id + '-switch'} checked={checked} onChange={onChange} disabled={disabled} />
                    <div className={Style.switch_slider}></div>
                </label>
                <label className={Style.switch_label}
                    htmlFor={id + '-switch'}>
                    {this.props.title}
                </label>
            </div>
        );
    }
}

export default PanelSwitch;
