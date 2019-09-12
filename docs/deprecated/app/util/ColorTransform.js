import * as ColorHelper from './ColorHelper.js';

export function dark(hex)
{
    //v < 0.15 ? lighten : darken
    const color = [];
    const inverted = [];
    ColorHelper.HEXtoRGB(hex, color);
    ColorHelper.invertRGB(color, true, inverted);
    ColorHelper.blendRGB(0.2, color, inverted, color);
    const result = ColorHelper.RGBtoHEX(color);
    return result;
}

export function invert(hex)
{
    const color = [];
    ColorHelper.HEXtoRGB(hex, color);
    ColorHelper.invertRGB(color, false, color);
    const result = ColorHelper.RGBtoHEX(color);
    return result;
}

export function lite(hex)
{
    //v < 0.15 ? lighten : darken
    const color = [];
    const inverted = [];
    ColorHelper.HEXtoRGB(hex, color);
    ColorHelper.invertRGB(color, true, inverted);
    ColorHelper.blendRGB(0.39, color, inverted, color);
    const result = ColorHelper.RGBtoHEX(color);
    return result;
}
