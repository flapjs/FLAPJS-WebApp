import React from 'react';
import PropTypes from 'prop-types';
import StyleInput from '../sourceStyle/StyleInput.jsx';

import { getElementFromRef } from '@flapjs/util/ElementHelper.js';
import { TinyColor } from '@ctrl/tinycolor';

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
        const computeElement = getElementFromRef(this.props.compute);
        if (computeElement)
        {
            computeElement.addEventListener('change', this.onComputeChange);
        }
    }
    
    /** @override */
    componentWillUnmount()
    {
        const computeElement = getElementFromRef(this.props.compute);
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
                    this.self.current.setValue(new TinyColor(e.value).darken(20).toHexString());
                    break;
                case 'lighten':
                    this.self.current.setValue(new TinyColor(e.value).brighten(20).toHexString());
                    break;
                case 'invert':
                    this.self.current.setValue(new TinyColor(e.value).complement().toHexString());
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
                onChange={props.onChange} />
        );
    }
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
