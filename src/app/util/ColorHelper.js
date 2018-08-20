/* RGB and HSL conversions: https://gist.github.com/mjackson/5311256 */
class ColorHelper
{
  static HEXtoRGB(hex, dst=[])
  {
    if (hex.startsWith('#')) hex = hex.slice(1);
    const red = hex.substring(0, 2);
    const green = hex.substring(2, 4);
    const blue = hex.substring(4, 6);
    dst[0] = parseInt(red, 16);
    dst[1] = parseInt(green, 16);
    dst[2] = parseInt(blue, 16);
    return dst;
  }

  static RGBtoHEX(r, g, b)
  {
    return '#' + (b | (g << 8) | (r << 16) | (1 << 24)).toString(16).slice(1);
  }

  static RGBtoHSV(r, g, b, dst=[])
  {
    r /= 255;
    g /= 255;
    b /= 255;
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
      switch(max)
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

  static HSVtoRGB(h, s, v, dst=[])
  {
    let r = 0;
    let g = 0;
    let b = 0;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch(i % 6)
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
}

export default ColorHelper;
