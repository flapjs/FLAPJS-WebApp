class GraphElement
{
  constructor(id)
  {
    this._id = id;
  }

  getCenterPoint(dst={x: 0, y: 0})
  {
    dst.x = 0;
    dst.y = 0;
    return dst;
  }

  setGraphElementID(graphElementID)
  {
    this._id = graphElementID;
    return this;
  }

  //A unique identifier for this graph element
  getGraphElementID()
  {
    return this._id;
  }

  //Calls getHashString() to generate an integer hash generally unqiue to the instance.
  //Should only be used to distinguish between other objects with the same
  //hash function. In other words, every instance should only be compared to
  //other instances of the same class.
  //usePosition can be used to tell the hash function whether or not to consider
  //aesthetic, or position, attributes of the element.
  getHashString(usePosition=true)
  {
    return this._id;
  }
}
export default GraphElement;
