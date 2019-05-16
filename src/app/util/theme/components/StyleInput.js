import React from 'react';

class StyleInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e)
    {
        const newValue = e.target.value;
        const value = this.props.value;
        value.setValue(newValue);
    }

    /** @override */
    render()
    {
        const title = this.props.title;
        const value = this.props.value;
        const variableName = value.getName();
        const variableValue = value.getValue();
        const inputID = 'styleopt-' + variableName;

        return (
            <span id={this.props.id}
                className={this.props.className}
                style={this.props.style}>
                <input id={inputID} type="color"
                    value={variableValue}
                    onChange={this.onChange}
                    disabled={this.props.disabled}/>
                <label htmlFor={inputID}>
                    {title}
                </label>
            </span>
        );
    }
}
export default StyleInput;
