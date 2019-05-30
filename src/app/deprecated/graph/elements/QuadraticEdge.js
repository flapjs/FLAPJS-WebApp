import GraphEdge from './GraphEdge.js';
import { getDirectionalVector, getMidPoint } from 'util/MathHelper.js';

/**
 * A class that represents the curved edge elements of a graph.
 * 
 * @see {@link NodeGraph}
 * @extends GraphEdge
 */
class QuadraticEdge extends GraphEdge
{
    /**
   * Creates a quadratic edge with the unique id.
   * @constructor
   * @param {String} id           The element id for this node.
   * @param {GraphNode} from      The from node of the edge.
   * @param {GraphNode} [to=null] The to node of the edge.
   */
    constructor(id, from, to = null)
    {
        super(id, from, null);

        //radians = the angle in radians, where 0 is the normal of midpoint
        //length = the distance from midpoint
        this._quad = {
            radians: 0,
            length: 0,
            coords: { x: 0, y: 0 }
        };

        // Make sure to format it correctly when creating...
        this.changeDestinationNode(to);
    }

    /**
   * Set the angle of the curve in radians
   * @param {Number} radians the radians the quadratic should be curved
   * @returns {this}
   */
    setQuadraticRadians(radians)
    {
        this._quad.radians = radians;
        return this;
    }

    /**
   * Set the distance of the curve from the midpoint
   * @param {Number} length the "height" of the curve
   * @returns {this}
   */
    setQuadraticLength(length)
    {
        this._quad.length = length;
        return this;
    }

    /**
   * Calculates and sets the quadratic vertex to pass through the position.
   * This will update the radians and length of the curve.
   * @param {Number} x the x coordinate
   * @param {Number} y the y coordinate
   * @returns {this}
   */
    setQuadraticByCoords(x, y)
    {
        const from = this._from;
        const to = this._to;
        const fromx = from.x;
        const fromy = from.y;
        const tox = to.x;
        const toy = to.y;

        let dx = tox - fromx;
        let dy = toy - fromy;
        const midpointx = fromx + dx / 2;
        const midpointy = fromy + dy / 2;

        // Remember: y-axis is flipped because canvas coord-space is -y => +y
        // Therefore, dy needs to be flipped
        const angleOffset = Math.atan2(-dy, dx);
        dx = x - midpointx;
        dy = y - midpointy;

        const PI = Math.PI;
        const HALFPI = PI / 2;
        // 0 rad = to the right
        // Also: angleOffset is the offset from midpoint angle, the orthogonal base vector
        // This is because the from and to could be flipped, and
        // therefore give a negative, or at least a reversed angle.
        let radians = Math.atan2(dy, dx) + angleOffset;
        let length = Math.sqrt(dx * dx + dy * dy);
        if (length < 0) length = 0;

        // -PI / 2 is outward
        const outrad = radians - (-HALFPI);
        // PI / 2 is inward
        const inrad = radians - (HALFPI);
        // TODO: Should be dependent on length, instead of a constant.
        const maxdr = PI / 20;

        if (Math.abs(length) < 8)
        {
            radians = 0;
            length = 0;
        }
        else if (outrad < maxdr && outrad > -maxdr)
        {
            // -PI / 2 is outward
            radians = -HALFPI;
        }
        else if (-inrad < maxdr && -inrad > -maxdr)
        {
            // PI / 2 is inward
            radians = HALFPI;
        }

        this._quad.radians = radians;
        this._quad.length = length;
        return this;
    }

    getQuadraticLength() { return this._quad.length; }
    getQuadraticRadians() { return this._quad.radians; }
    getQuadratic() { return this._quad; }
    isQuadratic() { return !this.isPlaceholder() && this._quad.length !== 0; }

    getQuadraticAsCoords()
    {
        const from = this._from;
        const to = this._to;
        const dst = this._quad.coords;
        if (from == null || to == null)
        {
            dst.x = 0;
            dst.y = 0;
        }
        else
        {
            /*
      //To mark dirty...
      _capture: {
        fx: 0, fy: 0,
        tx: 0, ty: 0,
        ql: 0, qr: 0
      }
      */
            getDirectionalVector(from.x, from.y, to.x, to.y, this._quad.length, this._quad.radians, dst);
        }
        return dst;
    }

    /** @override */
    getEdgeDirection()
    {
        let result = 0;
        if (this.isQuadratic())
        {
            const coords = this.getQuadraticAsCoords();
            result = Math.atan2(coords.y, coords.x) + Math.PI / 2;
        }
        else
        {
            result = super.getEdgeDirection();
        }

        return result;
    }

    /** @override */
    getStartPoint(dst = { x: 0, y: 0 })
    {
        const from = this._from;
        const to = this._to;

        if (!from) throw new Error('Source of edge cannot be null.');
        if (!to)
        {
            //Make sure to use quad for placeholder direction (not magnitude)
            const px = Math.cos(this._quad.radians);
            const py = Math.sin(this._quad.radians);
            const nodeSize = from.getNodeSize();
            dst.x = from.x + px * nodeSize;
            dst.y = from.y + py * nodeSize;
            return dst;
        }

        //Check if edge is following something other than a node...then remain flat
        if (!to.getNodeSize || !this.isQuadratic())
        {
            getDirectionalVector(from.x, from.y, to.x, to.y, from.getNodeSize(), 0, dst);
            dst.x += from.x;
            dst.y += from.y;
            return dst;
        }
        else
        {
            getMidPoint(from.x, from.y, to.x, to.y, dst);
            const qcoords = this.getQuadraticAsCoords();
            const qx = dst.x + qcoords.x;
            const qy = dst.y + qcoords.y;
            getDirectionalVector(from.x, from.y, qx, qy, from.getNodeSize(), this.isSelfLoop() ? (Math.PI / 4) : 0, dst);
            dst.x += from.x;
            dst.y += from.y;
            return dst;
        }
    }

    /** @override */
    getCenterPoint(dst = { x: 0, y: 0 })
    {
        const from = this._from;
        const to = this._to;

        if (!from) throw new Error('Source of edge cannot be null.');
        if (!to)
        {
            //Make sure to use quad for placeholder direction (not magnitude)
            const px = Math.cos(this._quad.radians);
            const py = Math.sin(this._quad.radians);
            const placeholderLength = from.getNodeSize() + this.getPlaceholderLength() / 2;
            dst.x = from.x + px * placeholderLength;
            dst.y = from.y + py * placeholderLength;
            return dst;
        }

        getMidPoint(from.x, from.y, to.x, to.y, dst);

        if (this.isQuadratic())
        {
            const qcoords = this.getQuadraticAsCoords();
            dst.x += qcoords.x;
            dst.y += qcoords.y;
        }

        return dst;
    }

    /** @override */
    getEndPoint(dst = { x: 0, y: 0 })
    {
        const from = this._from;
        const to = this._to;

        if (!from) throw new Error('Source of edge cannot be null.');
        if (!to)
        {
            //Make sure to use quadCoords for placeholder direction (not magnitude)
            const px = Math.cos(this._quad.radians);
            const py = Math.sin(this._quad.radians);
            const placeholderLength = from.getNodeSize() + this.getPlaceholderLength();
            dst.x = from.x + px * placeholderLength;
            dst.y = from.y + py * placeholderLength;
            return dst;
        }

        //Get end point for non-nodes...
        if (!to.getNodeSize)
        {
            return to;
        }
        //Get end point for straight edges...
        else if (!this.isQuadratic())
        {
            getDirectionalVector(to.x, to.y, from.x, from.y, to.getNodeSize(), 0, dst);
            dst.x += to.x;
            dst.y += to.y;
            return dst;
        }
        //Get end point for quadratics...
        else
        {
            getMidPoint(from.x, from.y, to.x, to.y, dst);
            const qcoords = this.getQuadraticAsCoords();
            const qx = dst.x + qcoords.x;
            const qy = dst.y + qcoords.y;
            getDirectionalVector(to.x, to.y, qx, qy, to.getNodeSize(), this.isSelfLoop() ? -(Math.PI / 4.0) : 0, dst);
            dst.x += to.x;
            dst.y += to.y;
            return dst;
        }
    }

    /** @override */
    getHashString(usePosition = true)
    {
        if (usePosition)
        {
            return super.getHashString(usePosition) + ':' + this._quad.radians + ',' + this._quad.length;
        }
        else
        {
            return super.getHashString(usePosition);
        }
    }

    // DEPRECATED STUFF BELOW!!!

    getSelfLoopHeight()
    {
        return this._from.getNodeSize();
    }

    formatAsSelfLoop()
    {
        this.setQuadraticRadians(-Math.PI / 2);
        this.setQuadraticLength(this._from.getNodeSize() + this.getSelfLoopHeight());
    }

    formatAsPlaceholder(prevDest)
    {
    //Quad is re-used to determine edge angle for placeholder
    //This can be used specifically for quad since regular quad is
    //dependent on this._to != null, which placeholder assumes this._to == null.
    //Also, quad.length is ignored, because the length should always be
    //getPlaceholderLength(). This is resolved by getStartPoint(), etc.
        if (prevDest)
        {
            const dx = this._from.x - prevDest.x;
            const dy = this._from.y - prevDest.y;
            const angle = -Math.atan2(dx, dy) - (Math.PI / 2);
            this._quad.radians = angle;
        }
        else
        {
            this._quad.radians = 0;
        }
    }

    /** @override */
    changeDestinationNode(node)
    {
        const prevDest = this._to;

        //Just to optimize this a little :)
        if (prevDest === node) return;

        super.changeDestinationNode(node);

        if (this.isPlaceholder())
        {
            this.formatAsPlaceholder(prevDest);
        }
        else if (this.isSelfLoop())
        {
            this.formatAsSelfLoop();
        }
    }
}

export default QuadraticEdge;