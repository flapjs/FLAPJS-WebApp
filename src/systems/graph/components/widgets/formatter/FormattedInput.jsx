import React from 'react';
import PropTypes from 'prop-types';

import DebounceInput from './DebounceInput.jsx';

class FormattedInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this._debounceComponent = React.createRef();

        this._submitOnBlurEvent = true;

        this.state = {
            value: '',
            prevValue: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    focus() { this._debounceComponent.current.focus(); }
    blur(submit = true)
    {
        this._submitOnBlurEvent = submit;
        this._debounceComponent.current.blur();
    }

    onFocus(e)
    {
        if (this.props.onFocus) this.props.onFocus(e);

        e.target.select();
    }

    onBlur(e)
    {
        if (this.props.onBlur) this.props.onBlur(e);

        if (!this._submitOnBlurEvent)
        {
            this._submitOnBlurEvent = true;
            this.setState((prev, props) =>
            {
                return { value: prev.prevValue };
            }, () =>
            {
                if (this.props.onCancel)
                {
                    const event = {
                        target: this._debounceComponent.getInputElement(),
                        value: this.state.value
                    };
                    this.props.onCancel(event);
                }
            });
        }
        else
        {
            this.setState((prev, props) =>
            {
                return { prevValue: prev.value };
            }, () =>
            {
                if (this.props.onSubmit)
                {
                    const event = {
                        target: this._debounceComponent.getInputElement(),
                        value: this.state.value
                    };
                    this.props.onSubmit(event);
                }
            });
        }
    }

    onKeyDown(e)
    {
        if (e.key === 'Enter')
        {
            // Allow Shift+Enter to create new lines if multiline is on.
            if (e.shiftKey && this.props.multiline) return;

            this.blur(true);

            e.preventDefault();
            e.stopPropagation();
        }
        else if (e.key === 'Escape')
        {
            this.blur(false);

            e.preventDefault();
            e.stopPropagation();
        }
    }

    onChange(e)
    {
        const event = {
            target: e.target,
            value: e.target.value,
            previous: this.state.value,
            position: this._debounceComponent.current.getCaretPosition()
        };

        if (this.props.onChange) this.props.onChange(event);

        this.setState((prev, props) =>
        {
            return { value: event.value };
        });
    }

    setValue(value, updatePrevious = false)
    {
        this.setState((prev, props) =>
        {
            const previous = prev.value;

            let result;
            const component = this._debounceComponent.current;
            if (component.hasCaretSelection())
            {
                result = previous;

                const caretPosition = component.getCaretPosition();
                result = result.substring(0, caretPosition.start) + value + result.substring(caretPosition.end);
                component.setCaretPosition(caretPosition.start, caretPosition.start + value.length);
            }
            else
            {
                result = value;
                component.setCaretPosition(0, value.length);
            }

            if (this.props.onChange)
            {
                const event = {
                    target: component.getInputElement(),
                    value: result,
                    previous: previous,
                    position: component.getCaretPosition()
                };

                this.props.onChange(event);

                result = event.value;
            }

            return {
                value: result,
                prevValue: updatePrevious ? result : prev.prevValue
            };
        });
        return this;
    }

    appendValue(value, updatePrevious = false)
    {
        this.setState((prev, props) =>
        {
            const previous = prev.value;

            let result;
            const component = this._debounceComponent.current;
            if (component.hasCaretPosition())
            {
                const caretPosition = component.getCaretPosition();
                if (caretPosition.end + 1 >= previous.length || caretPosition.start > caretPosition.end)
                {
                    result = previous + value;
                }
                else
                {
                    result = previous.substring(0, caretPosition.end) + value + previous.substring(caretPosition.end);
                }

                component.setCaretPosition(caretPosition.start, caretPosition.end + value.length);
            }
            else
            {
                result = previous + value;
            }

            if (this.props.onChange)
            {
                const event = {
                    target: component.getInputElement(),
                    value: result,
                    previous: previous,
                    position: component.getCaretPosition()
                };

                this.props.onChange(event);

                result = event.value;
            }

            return {
                value: result,
                prevValue: updatePrevious ? result : prev.prevValue
            };
        });
    }

    getDebounceComponent() { return this._debounceComponent.current; }
    getInputElement() { return this._debounceComponent.current.getInputElement(); }
    getValue() { return this.state.value; }

    hasFocus() { return this._debounceComponent.current.hasFocus(); }

    /** @override */
    render()
    {
        return (
            <DebounceInput
                {...this.props}
                ref={this._debounceComponent}
                type="text"
                rows="1"
                spellCheck="false"
                style={{ resize: this.props.multiline ? 'both' : 'none' }}
                value={this.state.value}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}

                onFocus={this.onFocus}
                onBlur={this.onBlur} />
        );
    }
}
FormattedInput.propTypes = {
    multiline: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default FormattedInput;
