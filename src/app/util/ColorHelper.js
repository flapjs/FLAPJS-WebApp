const RGB_WHITE = [255, 255, 255];
const RGB_BLACK = [0, 0, 0];

export function grayscaleRGB(rgb, dst = [])
{
    const grayscaleAmount = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    dst[0] = grayscaleAmount;
    dst[1] = grayscaleAmount;
    dst[2] = grayscaleAmount;
    return dst;
}

export function blendRGB(percent, rgb1, rgb2 = null, dst = [])
{
    const blendAmount = Math.abs(percent);
    if (!rgb2) rgb2 = percent < 0 ? RGB_BLACK : RGB_WHITE;

    dst[0] = rgb1[0] + Math.round(blendAmount * (rgb2[0] - rgb1[0]));
    dst[1] = rgb1[1] + Math.round(blendAmount * (rgb2[1] - rgb1[1]));
    dst[2] = rgb1[2] + Math.round(blendAmount * (rgb2[2] - rgb1[2]));
    return dst;
}

export function invertRGB(rgb, blackwhite = false, dst = [])
{
    if (blackwhite)
    {
        // http://stackoverflow.com/a/3943023/112731
        if ((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 186)
        {
            dst[0] = 0;
            dst[1] = 0;
            dst[2] = 0;
        }
        else
        {
            dst[0] = 0xFF;
            dst[1] = 0xFF;
            dst[2] = 0xFF;
        }
    }
    else
    {
        dst[0] = (255 - rgb[0]);
        dst[1] = (255 - rgb[1]);
        dst[2] = (255 - rgb[2]);
    }
    return dst;
}

/* RGB and HSL conversions: https://gist.github.com/mjackson/5311256 */
export function HEXtoRGB(hex, dst = [])
{
    if (hex.indexOf('#') === 0) hex = hex.slice(1);
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) throw new Error('Invalid hex color format');
    const red = hex.substring(0, 2);
    const green = hex.substring(2, 4);
    const blue = hex.substring(4, 6);

    dst[0] = parseInt(red, 16);
    dst[1] = parseInt(green, 16);
    dst[2] = parseInt(blue, 16);
    return dst;
}
export function RGBtoHEX(rgb)
{
    return '#' + (rgb[2] | (rgb[1] << 8) | (rgb[0] << 16) | (1 << 24)).toString(16).slice(1);
}
export function RGBtoHSV(rgb, dst = [])
{
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    const s = max == 0 ? 0 : d / max;
    const v = max;
    if (max == min)
    {
        h = 0;
    }
    else
    {
        switch (max)
        {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    dst[0] = h;
    dst[1] = s;
    dst[2] = v;
    return dst;
}
export function HSVtoRGB(h, s, v, dst = [])
{
    let r = 0; let g = 0; let b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6)
    {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    }

    dst[0] = r * 255;
    dst[1] = g * 255;
    dst[2] = b * 255;
    return dst;
}
