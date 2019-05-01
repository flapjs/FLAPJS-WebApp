import React from 'react';
import Style from './PanelCheckbox.css';

class PanelCheckbox extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            checked: props.initial || false
        };

        this.onChange = this.onChange.bind(this);
    }

    setChecked(value)
    {
        this.setState({checked: value});
    }

    isChecked()
    {
        return this.state.checked;
    }

    onChange(e)
    {
        const checked = e.target.checked;
        if (this.state.checked !== checked)
        {
            this.setState({checked: checked});
        }
    }

    /** @override */
    render()
    {
        return (
            <div id={this.props.id}
                className={Style.checkbox_container +
          ' ' + this.props.className}
                style={this.props.style}>
                <input type="checkbox" id={this.props.id + '-checkbox'}
                    name={this.props.id + '-checkbox'} value={this.props.value}
                    checked={this.state.checked}
                    disabled={this.props.disabled}
                    onChange={this.onChange}/>
                <label htmlFor={this.props.id + '-checkbox'}>{this.props.title}</label>
            </div>
        );
    }
}

export default PanelCheckbox;
