/**
 * Contains utility functions for file-related actions.
 *
 * @module FileHelper
 */

/**
 * Gets the file extension of the name.
 * 
 * @param {string} name The file name to parse.
 * @returns {string} The file extension for the name or empty string if none found.
 */
export function getFileExtFromName(name)
{
    if (!name) return '';
    const index = name.lastIndexOf('.');
    if (index < 0) return '';
    return name.substring(index);
}
