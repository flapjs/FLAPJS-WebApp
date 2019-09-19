import PropTypes from 'prop-types';
import { text, number, boolean, object, button, /* select */ } from '@storybook/addon-knobs';

// Here's an existing implementation:
// https://github.com/storybookjs/addon-smart-knobs/blob/master/src/index.js

function getKnobForPropType(propType)
{
    switch(propType)
    {
        case PropTypes.string: return text;
        case PropTypes.number: return number;
        case PropTypes.bool: return boolean;
        case PropTypes.object: return object;
        case PropTypes.array: return object;
        case PropTypes.node: return text;
        // You can't possible give it an element...
        case PropTypes.element: return (name, value, rangeGroupID) => button(name, () => {}, rangeGroupID);
        // You can't possible give it a function... (yet?)
        case PropTypes.func: return (name, value, rangeGroupID) => button(name, () => {}, rangeGroupID);
        // Missing enum and union prop types... (use select)
        default: return text;
    }
}

/**
 * Gets the appropriate knobs based on PropTypes and default values of the React component class.
 * 
 * @param {Class} elementClass                  The React component class to find prop types
 *                                              from to create the respective knobs.
 * @param {string} [rangeGroupID]               The group id for the evaluated props. This is
 *                                              an optional parameter that can be omitted
 *                                              (without placeholder) or set as undefined.
 * @param {number|Array} [rangeStart=-1]        The start index at which to process the prop types
 *                                              (by prop type definition order). If negative, it
 *                                              is assumed from the first prop. If an array, this will
 *                                              be treated as a whitelist of prop names and rangeEnd
 *                                              will be treated as the opts parameter instead.
 * @param {number|object} [rangeEnd=-1]         The end index at which to process the prop types
 *                                              (by prop type definition order). If negative, it is
 *                                              assumed to the last prop after the start index. If
 *                                              rangeStart is an array, this will be treated as the
 *                                              opts parameter instead. Later parameters are ignored.
 * @param {object} [opts]                       Any additional options.
 * @param {boolean} [opts.defaultOnly=false]    If true, will only show props with default values as
 *                                              defined by defaultProps.
 * @returns {object}                            The prop knob object.
 */
export function propKnobs(elementClass, rangeGroupID, rangeStart = -1, rangeEnd = -1, opts)
{
    // Allow rangeGroupID to be an optional param...
    if (typeof rangeGroupID === 'number')
    {
        opts = rangeEnd;
        rangeEnd = rangeStart;
        rangeStart = rangeGroupID;
        rangeGroupID = undefined;
    }

    // Allow range by defined by whitelist...
    let whitelist;
    if (Array.isArray(rangeStart))
    {
        whitelist = rangeStart;
        opts = rangeEnd;
        rangeStart = -1;
        rangeEnd = -1;
        opts = undefined;
    }

    const result = {};
    // Makes sure elementClass has defined propTypes...
    if (elementClass && elementClass.propTypes)
    {
        const propTypes = Object.entries(elementClass.propTypes);
        const propDefaults = elementClass.defaultProps;

        let range = propTypes.length;
        if (rangeStart >= range) return result;
        if (rangeStart < 0) rangeStart = 0;
        else if (rangeEnd < range && rangeEnd >= rangeStart) range = Math.min(range, rangeEnd - rangeStart);

        for(let i = rangeStart; i < range; ++i)
        {
            let [propName, propType] = propTypes[i];

            // Only allow whitelisted props if defined...
            if (whitelist && !whitelist.includes(propName)) continue;

            let defaultValue = undefined;
            // Makes sure elementClass has defined defaultValues...
            if (propDefaults)
            {
                defaultValue = propDefaults[propName];
            }
            else if (opts && opts.defaultOnly)
            {
                continue;
            }

            let knob = getKnobForPropType(propType);
            // Set the prop... (if the defaultValue is not set, it is left blank)
            if (knob)
            {
                result[propName] = knob(propName, defaultValue, rangeGroupID);
            }
        }
    }
    return result;
}
