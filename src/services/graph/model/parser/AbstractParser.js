/**
 * A class that represents a parser that can encode (compose)
 * and decode (parse) to and from a target object and data.
 */
class AbstractParser
{
    constructor() {}

    /**
     * Parses the data object to another object.
     * 
     * @param  {object} data    The data to parse.
     * @param  {*} [dst=null]   The target to set parsed data. If this is null, the
     *                          data will be set on a new target and returned.
     * @returns {*}             The result in the passed-in dst.
     */
    parse(data, dst = null)
    {
        return dst;
    }

    /**
     * Composes an object from the target.
     * 
     * @param  {*} target               The target to compose into data.
     * @param  {object} [dst=null]      The object to append the composed data. If this
     *                                  is null, the data will be set on a new empty
     *                                  object and returned.
     * @returns {object}                The result in the passed-in dst.
     */
    compose(target, dst = null)
    {
        return dst;
    }
}

export default AbstractParser;
