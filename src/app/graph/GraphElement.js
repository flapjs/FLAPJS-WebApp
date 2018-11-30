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
}
export default GraphElement;
