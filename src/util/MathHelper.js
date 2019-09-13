/**
 * Contains utility functions for useful math algorithms.
 * @module MathHelper
 */

/**
 * Generates a uuid v4.
 * 
 * @param {Number} a The placeholder (serves for recursion within function).
 * @returns {String} the universally unique id
 */
export function uuid(a = undefined)
{
    // https://gist.github.com/jed/982883
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
}

/**
 * Interpolates, or lerps, between 2 values by the specified amount, dt.
 * 
 * @param {Number} a the initial value
 * @param {Number} b the final value
 * @param {Number} dt the amount changed
 * @returns {Number} the interpolated value
 */
export function lerp(a, b, dt)
{
    return a * (1 - dt) + b * dt;
}

/**
 * Generates a number hash for the string. For an empty string, it will return 0.
 * 
 * @param {String} [value=''] the string to hash
 * @returns {Number} a hash that uniquely identifies the string
 */
export function stringHash(value='')
{
    let hash = 0;
    for(let i = 0, len = value.length; i < len; i++)
    {
        hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
    }
    return hash;
}

/**
 * Calculates the directional vector for the passed-in points.
 * 
 * @param {Number} x1 the x component of the source point
 * @param {Number} y1 the y component of the source point
 * @param {Number} x2 the x component of the destination point
 * @param {Number} y2 the y component of the destination point
 * @param {Number} [dist=1] the distance, or length, of the vector
 * @param {Number} [angleOffset=0] additional angle offset from the calculated direction vector
 * @param {Object} [dst={x: 0, y: 0}] the result
 * @returns {Object} dst
 */
export function getDirectionalVector(x1, y1, x2, y2, dist=1, angleOffset=0, dst={x: 0, y: 0})
{
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx) + angleOffset;
    dst.x = Math.cos(angle) * dist;
    dst.y = Math.sin(angle) * dist;
    return dst;
}

/**
 * Calculates the midpoint between the passed-in points.
 * 
 * @param {Number} x1 the x component of the source point
 * @param {Number} y1 the y component of the source point
 * @param {Number} x2 the x component of the destination point
 * @param {Number} y2 the y component of the destination point
 * @param {Object} [dst={x: 0, y: 0}] the result
 * @returns {Object} dst
 */
export function getMidPoint(x1, y1, x2, y2, dst={x: 0, y: 0})
{
    dst.x = x1 + (x2 - x1) / 2;
    dst.y = y1 + (y2 - y1) / 2;
    return dst;
}
