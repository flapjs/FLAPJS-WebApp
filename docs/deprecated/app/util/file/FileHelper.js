/**
 * Contains utility functions for file-related actions.
 * @module FileHelper
 */

/**
 * Gets the file extension of the name.
 * 
 * @param {String} name the file name to parse
 * @returns {String} the file extension for the name or empty string if none found
 */
export function getFileExtFromName(name)
{
    if (!name) return '';
    const index = name.lastIndexOf('.');
    if (index < 0) return '';
    return name.substring(index);
}