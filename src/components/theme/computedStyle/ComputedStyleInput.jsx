import React from 'react';
import PropTypes from 'prop-types';
import StyleInput from '../sourceStyle/StyleInput.jsx';

import * as ColorHelper from '../ColorHelper.js';

/**
 * A React component that can compute and control a style
 * property of one or another DOM element.
 */
class ComputedStyleInput extends React.Component
{
    constructor(props)
    {
        super(props);

        this.self = React.createRef();

        this.onComputeChange = this.onComputeChange.bind(this);
    }
    
    /** @override */
    componentDidMount()
    {
        let computeElement;
        if (typeof this.props.compute === 'function')
        {
            computeElement = this.props.compute.call(null);
        }
        else
        {
            computeElement = this.props.compute.current;
        }

        if (computeElement)
        {
            computeElement.addEventListener('change', this.onComputeChange);
        }
    }
    
    /** @override */
    componentWillUnmount()
    {
        let computeElement;
        if (typeof this.props.compute === 'function')
        {
            computeElement = this.props.compute.call(null);
        }
        else
        {
            computeElement = this.props.compute.current;
        }

        if (computeElement)
        {
            computeElement.removeEventListener('change', this.onComputeChange);
        }
    }

    onComputeChange(e)
    {
        const computeFunction = this.props.computeFunction;
        if (typeof computeFunction === 'function')
        {
            computeFunction.call(null, e.value);
        }
        else
        {
            switch(computeFunction)
            {
                case 'darken':
                    this.self.current.setValue(darkenHEX(e.value));
                    break;
                case 'lighten':
                    this.self.current.setValue(lightenHEX(e.value));
                    break;
                case 'invert':
                    this.self.current.setValue(invertHEX(e.value));
                    break;
                case 'copy':
                    this.self.current.setValue(e.value);
                    break;
                default:
                    throw new Error(`Unknown compute function '${computeFunction}.'`);
            }
        }
    }

    /** @override */
    render()
    {
        const props = this.props;
        
        return (
            <StyleInput
                ref={this.self}
                className={props.className}
                source={props.source}
                name={props.name}
                type={props.type}
                disabled={props.disabled}
                onChange={props.onChange}/>
        );
    }
}

function darkenHEX(hex)
{
    //v < 0.15 ? lighten : darken
    const color = [];
    const inverted = [];
    ColorHelper.HEXtoRGB(hex, color);
    ColorHelper.invertRGB(color, true, inverted);
    ColorHelper.blendRGB(0.2, color, inverted, color);
    return ColorHelper.RGBtoHEX(color);
}

function lightenHEX(hex)
{
    //v < 0.15 ? lighten : darken
    const color = [];
    const inverted = [];
    ColorHelper.HEXtoRGB(hex, color);
    ColorHelper.invertRGB(color, true, inverted);
    ColorHelper.blendRGB(0.39, color, inverted, color);
    return ColorHelper.RGBtoHEX(color);
}

function invertHEX(hex)
{
    const color = [];
    ColorHelper.HEXtoRGB(hex, color);
    ColorHelper.invertRGB(color, false, color);
    return ColorHelper.RGBtoHEX(color);
}

ComputedStyleInput.propTypes = {
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
    compute: PropTypes.oneOfType([
        PropTypes.shape({
            current: PropTypes.instanceOf(StyleInput)
        }),
        PropTypes.func,
    ]).isRequired,
    computeFunction: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.oneOf([
            'darken',
            'lighten',
            'invert',
            'copy',
        ])
    ]),
};
ComputedStyleInput.defaultProps = {
    disabled: false,
    type: 'color',
    computeFunction: 'copy',
};

export default ComputedStyleInput;
