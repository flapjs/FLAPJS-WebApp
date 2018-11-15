import Config from 'config.js';

class Viewport
{
  constructor()
  {
    this._element = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._nextOffsetX = 0;
    this._nextOffsetY = 0;

    this._scale = 1;
  }

  setElement(element)
  {
    this._element = element;
  }

  update()
  {
    const dx = this._nextOffsetX - this._offsetX;
    this._offsetX += dx * Config.SMOOTH_OFFSET_DAMPING;
    const dy = this._nextOffsetY - this._offsetY;
    this._offsetY += dy * Config.SMOOTH_OFFSET_DAMPING;
  }

  transformScreenToView(clientX, clientY)
  {
    if (!this._element) return {x: clientX - this._offsetX, y: clientY - this._offsetY};

    const ctm = this._element.getScreenCTM();
    return {
      x: (clientX - ctm.e) / ctm.a - this._offsetX,
      y: (clientY - ctm.f) / ctm.d - this._offsetY
    };
  }

  setOffset(x, y, immediate=false)
  {
    if (immediate)
    {
      this._nextOffsetX = this._offsetX = x;
      this._nextOffsetY = this._offsetY = y;
    }
    else
    {
      this._nextOffsetX = x;
      this._nextOffsetY = y;
    }
  }

  addOffset(dx, dy, immediate=false)
  {
    if (immediate)
    {
      this._offsetX += dx;
      this._offsetY += dy;
      this._nextOffsetX = this._offsetX;
      this._nextOffsetY = this._offsetY;
    }
    else
    {
      this._nextOffsetX += dx;
      this._nextOffsetY += dy;
    }
  }

  setScale(scale)
  {
    this._scale = Math.min(Config.MAX_SCALE, Math.max(Config.MIN_SCALE, scale));
  }

  addScale(dscale)
  {
    this._scale += dscale;
  }

  getOffsetX()
  {
    return this._offsetX;
  }

  getOffsetY()
  {
    return this._offsetY;
  }

  getScale()
  {
    return this._scale;
  }
}

export default Viewport;
