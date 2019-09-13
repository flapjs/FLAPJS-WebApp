import React from 'react';
import PropTypes from 'prop-types';

export const SUBMIT_DELAY = 30;
export const SUBMIT_KEY = 'Enter';
export const CANCEL_KEY = 'Escape';

class PatternInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.inputElement = null;

        this.placeholder = '';
        this.maxLength = 524288;/*This is the default value*/
        this.multiLine = true;
        this.formatter = null;

        this._submitTimeout = null;
        this._submit = props.submitOnBlur;
        this._skipBlur = false;
        this._skipSelect = false;

        this.state = {
            prevValue: '',
            value: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    setFormatter(formatter)
    {
        this.formatter = formatter;
        return this;
    }

    setPlaceholder(placeholder)
    {
        this.placeholder = placeholder;
        return this;
    }

    onFocus(e)
    {
        if (this._skipSelect)
        {
            this.inputElement.select();
            this._skipSelect = false;
        }
    }

    onBlur(e)
    {
        if (!this._submitTimeout)
        {
            this._submitTimeout = setTimeout(() => 
            {
                this._submitTimeout = null;
                if (this._skipBlur) return;

                const submit = this._submit;
                this._submit = this.props.submitOnBlur;
                if (document.activeElement !== this.inputElement && submit)
                {
                    const value = this.state.value;
                    if (this.props.onSubmit) this.props.onSubmit(value);

                    this.setState({ prevValue: value });
                }
                else
                {
                    this.setState((prev, props) => 
                    {
                        return { value: prev.prevValue };
                    });
                }

                if (this.props.onBlur) this.props.onBlur(e);
            }, SUBMIT_DELAY);
        }
    }

    onKeyDown(e)
    {
        if (e.key === SUBMIT_KEY)
        {
            if (e.shiftKey && this.multiLine) return;

            this._submit = true;
            this.inputElement.blur();

            e.preventDefault();
            e.stopPropagation();
        }
        else if (e.key === CANCEL_KEY)
        {
            this.setState((prev, props) => 
            {
                return { value: prev.prevValue };
            }, () => 
            {
                this._submit = false;
                this.inputElement.blur();
            });

            e.preventDefault();
            e.stopPropagation();
        }
    }

    onChange(e)
    {
        const target = e.target;
        const caretPosition = target.selectionStart;
        let value = target.value;
        if (this.formatter)
        {
            value = this.formatter(value, this.state.value);
        }

        this.setState({ value: value }, () => 
        {
            target.selectionEnd = caretPosition;
        });
    }

    focus(select = true)
    {
        this._skipSelect = select;
        this.inputElement.focus();
    }

    ignoreBlur(ignore)
    {
        const prev = this._skipBlur;
        this._skipBlur = ignore;
        return prev !== ignore;
    }

    appendValue(string, separator = '', format = true)
    {
        const value = this.state.value;
        if (value && value.length + string.length > this.maxLength) return;

        let result;
        if (value && value.length > 0)
        {
            result = value + separator + string;
        }
        else
        {
            result = string;
        }

        if (format && this.formatter)
        {
            result = this.formatter(result, this.state.value);
        }

        this.setState((prev, props) => 
        {
            return { value: result };
        });
    }

    resetValue(string)
    {
        this.setState({ prevValue: string, value: string });
    }

    setValue(string, format = true)
    {
        let value = string;
        if (format && this.formatter)
        {
            value = this.formatter(value, this.state.value);
        }
        this.setState({ value: value });
    }

    getValue()
    {
        return this.state.value;
    }

    /** @override */
    render()
    {
        const placeholder = this.placeholder;
        const maxlength = this.maxLength;
        const multiline = this.multiLine;
        const disabled = this.props.disabled;

        const value = this.state.value;

        return (
            <div id={this.props.id}
                className={this.props.className}
                style={this.props.style}>
                {
                    multiline ?
                        <textarea ref={ref => this.inputElement = ref}
                            type="text" rows="1" spellCheck="false"
                            disabled={disabled}
                            placeholder={placeholder}
                            maxLength={maxlength}
                            value={value || ''}
                            onChange={this.onChange}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            onKeyDown={this.onKeyDown} />
                        :
                        <input ref={ref => this.inputElement = ref}
                            type="text" spellCheck="false"
                            disabled={disabled}
                            placeholder={placeholder}
                            maxLength={maxlength}
                            value={value || ''}
                            onChange={this.onChange}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            onKeyDown={this.onKeyDown} />
                }
            </div>
        );
    }
}
PatternInput.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    submitOnBlur: PropTypes.bool,
    onSubmit: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
};

export default PatternInput;
