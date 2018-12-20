import { stringHash } from 'util/MathHelper.js';

class GraphElement
{
  constructor(id)
  {
    this._id = id;
  }

  setGraphElementID(graphElementID)
  {
    this._id = graphElementID;
    return this;
  }

  getGraphElementID()
  {
    return this._id;
  }

  getHashCode()
  {
    return stringHash(this._id);
  }
}
export default GraphElement;
