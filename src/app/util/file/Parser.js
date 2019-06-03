
/**
 * A class that represents a parser that can encode (compose)
 * and decode (parse) to and from a target object and data.
 */
class Parser
{
    constructor() {}

    /**
     * Parses the data object to another object.
     * 
     * @param  {Object} data    the data to parse.
     * @param  {*} [dst=null]   the target to set parsed data. If this is null, the
     *                          data will be set on a new target and returned.
     * @return {*}              the result in the passed-in dst.
     */
    parse(data, dst = null)
    {
        return dst;
    }

    /**
     * Composes an object from the target.
     * 
     * @param  {*} target               the target to compose into data.
     * @param  {Object} [dst=null]      the object to append the composed data. If this
     *                                  is null, the data will be set on a new empty
     *                                  object and returned.
     * @return {Object}                 the result in the passed-in dst.
     */
    compose(target, dst = null)
    {
        return dst;
    }
}

export default Parser;
