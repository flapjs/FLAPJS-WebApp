const ROUTER = {
  _current: null,
  routeTo(component)
  {
    this._current = component;
  },
  getCurrentPage()
  {
    return this._current;
  }
};

export default ROUTER;
