const ROUTER = {
  pathname: "/",
  _pages: new Map(),
  _404: null,
  registerPage: function(path, page) {
    if (path && path != "/404")
    {
      ROUTER._pages.set(path, page);
    }
    else
    {
      ROUTER._404 = page;
    }
  },
  getPage: function() {
    const path = ROUTER.pathname;
    if (ROUTER._pages.has(path))
    {
      return ROUTER._pages.get(path);
    }
    else
    {
      return ROUTER._404;
    }
  },
  routeTo(path) {
    ROUTER.pathname = path;
  }
};

export default ROUTER;
