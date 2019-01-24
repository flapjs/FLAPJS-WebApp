class GraphChangeHandler
{
  constructor(callback, refreshTicks=10)
  {
    if (typeof callback !== 'function')
      throw new Error("Must specify callback for handler");

    this._callback = callback;

		this._cachedGraphHash = 0;

    this._refreshTicks = refreshTicks;
    this._elapsedTicks = Infinity;
  }

  reset()
  {
    this._elapsedTicks = 0;
    this._cachedGraphHash = 0;
  }

  update(graph)
  {
    if (++this._elapsedTicks >= this._refreshTicks)
    {
      this._elapsedTicks = 0;

      const graphHash = graph.getHashCode(false);
      if (graphHash !== this._cachedGraphHash)
      {
        this._cachedGraphHash = graphHash;
        this._callback(graph);
      }
    }
  }
}

export default GraphChangeHandler;
