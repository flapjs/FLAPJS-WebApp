import React from 'react';
import PropTypes from 'prop-types';

import { getElementFromRef } from '@flapjs/util/ElementHelper.js';

/**
 * A React component that can control a style property of a DOM element.
 */
class StyleInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            value: '#FFFFFF'
        };

        this.eventListeners = [];

        this.onChange = this.onChange.bind(this);
    }

    addEventListener(event, callback)
    {
        // NOTE: Although not very React-like, it is necessary for computed styles.
        if (event === 'change')
        {
            this.eventListeners.push(callback);
        }
        else
        {
            throw new Error(`Cannot add listener for unknown event ${event}.`);
        }
    }

    removeEventListener(event, callback)
    {
        if (event === 'change')
        {
            const index = this.eventListeners.indexOf(callback);
            if (index >= 0)
            {
                this.eventListeners.splice(index, 1);
            }
            // Silently ignore if it does not exist...
        }
        else
        {
            throw new Error(`Cannot remove listener for unknown event ${event}.`);
        }
    }

    setValue(value, callback = undefined, updateSource = true)
    {
        const sourceElement = getElementFromRef(this.props.source);
        const sourceName = this.props.name;

        if (this.state.value !== value)
        {
            this.setState({ value }, () =>
            {
                if (updateSource)
                {
                    sourceElement.style.setProperty(sourceName, value);
                }

                if (this.props.onChange) this.props.onChange.call(null, { target: this, value });
                if (this.eventListeners.length > 0)
                {
                    const event = { target: this, value };
                    for(const eventListener of this.eventListeners)
                    {
                        eventListener.call(null, event);
                    }
                }
                if (callback) callback.call(null);
            });
        }
    }

    getValue()
    {
        return this.state.value;
    }

    onChange(e)
    {
        this.setValue(e.target.value);
    }

    /** @override */
    componentDidMount()
    {
        const element = getElementFromRef(this.props.source);
        const name = this.props.name;
        const style = window.getComputedStyle(element);
        const value = style.getPropertyValue(name);
        if (value)
        {
            this.setState({ value: value.trim() });
        }
        else
        {
            this.setState({ value: null });
        }
    }

    /** @override */
    render()
    {
        const props = this.props;
        const state = this.state;

        const value = state.value;
        const disabled = props.disabled;
        const type = props.type;
        
        return (
            <input
                className={props.className || ''}
                type={type}
                value={value}
                disabled={disabled}
                onChange={this.onChange}/>
        );
    }
}

StyleInput.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    source: PropTypes.oneOfType([
        PropTypes.shape({
            current: PropTypes.instanceOf(Element)
        }),
        PropTypes.func,
    ]).isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        'color',
        'text',
        'number',
    ]),
    onChange: PropTypes.func,
};
StyleInput.defaultProps = {
    disabled: false,
    type: 'color',
};

export default StyleInput;
