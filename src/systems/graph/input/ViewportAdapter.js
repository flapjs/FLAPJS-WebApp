import { stringHash } from '@flapjs/util/MathHelper.js';

/**
 * Represents and handles the transformations to the interactible viewport of
 * the SVG element.
 */
class ViewportAdapter
{
    constructor()
    {
        this._element = null;
        this._offsetX = 0;
        this._offsetY = 0;
        this._nextOffsetX = 0;
        this._nextOffsetY = 0;
        this._offsetDamping = 0.1;

        this._scaleFactor = 1;
        this._minScale = 1;
        this._maxScale = 1;
    }

    setElement(element)
    {
        this._element = element;
        return this;
    }

    setMinScale(scale)
    {
        this._minScale = scale;
        if (this._scaleFactor < this._minScale) this._scaleFactor = this._minScale;
        return this;
    }

    setMaxScale(scale)
    {
        this._maxScale = scale;
        if (this._scaleFactor > this._maxScale) this._scaleFactor = this._maxScale;
        return this;
    }

    setOffsetDamping(damping)
    {
        this._offsetDamping = damping;
        return this;
    }

    update()
    {
        const dx = this._nextOffsetX - this._offsetX;
        this._offsetX += dx * this._offsetDamping;
        const dy = this._nextOffsetY - this._offsetY;
        this._offsetY += dy * this._offsetDamping;
    }

    transformScreenToView(clientX, clientY)
    {
        if (!this._element) return { x: clientX - this._offsetX, y: clientY - this._offsetY };

        const ctm = this._element.getScreenCTM();
        return {
            x: (clientX - ctm.e) / ctm.a - this._offsetX,
            y: (clientY - ctm.f) / ctm.d - this._offsetY
        };
    }

    setOffset(x, y, immediate = false)
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

    addOffset(dx, dy, immediate = false)
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

    setScale(scale) { this._scaleFactor = Math.min(this._maxScale, Math.max(this._minScale, scale)); }
    addScale(dscale) { this._scaleFactor = Math.min(this._maxScale, Math.max(this._minScale, this._scaleFactor + dscale)); }
    getOffsetX() { return this._offsetX; }
    getOffsetY() { return this._offsetY; }
    getOffsetDamping() { return this._offsetDamping; }
    getScale() { return this._scaleFactor; }
    getMinScale() { return this._minScale; }
    getMaxScale() { return this._maxScale; }
    getElement() { return this._element; }

    getHashCode()
    {
        return stringHash(this._offsetX + ':' + this._offsetY + ',' + this._scaleFactor);
    }
}

export default ViewportAdapter;
