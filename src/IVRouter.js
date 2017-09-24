import RouterUtils from './utils';

export default class IVRouter {

  /**
    Options are the main DEEPLINKABLE route paths e.g.
    "home": Controller.method
    "media/:id": Controller.method
    "media/:id/:stuff": Controller.method
    "paywall": Controller.method
  */
  constructor(routes) {
    this._history = [];
    this._routes = {};

    // route keys are the strings passed in from the client that define the routes
    let routeKeys = Object.keys(routes);
    for (let i = 0; i < routeKeys.length; i++) {

      // extract the slug from the url e.g. media/:id --> "media" is the slug
      let key = RouterUtils.extractSlug(routeKeys[i]);

      if (key) {
        // if there is no existing [] for that route key, then create a []
        if (!this._routes[key]) {
          this._routes[key] = [];
        }

        // use the key as a lookup and push into it
        // 1 - the route to match e.g. /media/:id/blah
        // 2 - a regex to match the route
        // 3 - a handler function to handle the route
        this._routes[key].push({
          keyDefs: routeKeys[i],
          regex: RouterUtils.convertRouteToRegex(routeKeys[i]),
          handler: routes[routeKeys[i]]
        });
      }
    }

    window.onhashchange = (state) => {
      this.checkHash(state);
    }

    this.checkHash(true);
  }

  checkHash(e) {
    const hash = (window.location.hash) ? window.location.hash.slice(1) : '';

    if (e) {
      // extract the key from the url.  The key is the "slug"
      let key = RouterUtils.extractSlug(hash);

      // use the key to get the list of sub routes
      let subRoutes = this._routes[key];

      if (e.newURL !== e.oldURL || e === true) {
        RouterUtils.processRoute(subRoutes, hash);
      }
    }
  }

  navigateTo(url) {
    console.log('navigating to: ' + url);
    window.location.hash = url;
  }

  navigateBack() {
    window.history.back();
  }
}
