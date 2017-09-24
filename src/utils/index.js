let RouterUtils = {

  /**
    Extracts the slug i.e. the key of a url.  
    The slug is defined by the text before the first '/' in the URL.

    e.g. 'home/stuff' - "home" is the slug
    e.g. 'media' - "media" is the slug
    e.g. '/media' - this is invalid
    e.g. '/media/stuff' - this is invalid
  */
  extractSlug(url) {
    let slashIndex = url.indexOf('/');
    let keyLength = (slashIndex === -1) ? url.length : slashIndex;
    let slug = url.substring(0, keyLength) || null;

    return slug;
  },

  /**
    Converts a given route url string to a regular expression
    @return regex of route url
  */
  convertRouteToRegex(route) {
    let escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    let optionalParam = /\((.*?)\)/g;
    let namedParam    = /(\(\?)?:\w+/g;
    let splatParam    = /\*\w+/g;
    route = route.replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, (match, optional) => {
        return optional ? match : '([^/?]+)';
      })
      .replace(splatParam, '([^?]*?)');
    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  },

  /**
    Parses a route given a partial url.  The route must have a regex attached to it
    to help destruct the url into a keyed JSON object that matches the route definition.
    @param route : the route object to parse for params
    @param urlFragment : the partial URL to parse
    @return JSON that matches the descriptors
  */
  parseParameters(route, urlFragment) {

    let params = this.extractParameters(route.regex, urlFragment);

    // split ids
    let ids = route.keyDefs.split('/:');
    if (ids.length > 1) {
      ids.shift();
    }

    // assemble JSON object path
    let ret = {
      query: {}
    };
    ids.forEach((id, i) => {
      ret[id] = params[i];
    });

    // check for any query params
    let queryParams = params[params.length - 1];
    if (queryParams) {
      let tmpParams = queryParams.split('&');

      tmpParams.forEach((queryParam) => {
        let tmp = queryParam.split('=');
        ret.query[tmp[0]] = tmp[1] || '';
      });
    }

    return ret;
  },

  /**
    Given an array of subroutes and a url,
    call the handler that is to handle the subroute that matches the url
  */
  processRoute(subRoutes, url) {

    // if no routes exist, then send to 404
    if (!subRoutes) {
      // TODO: send to 404 - should never get here
      console.error('TODO: route to 404');
    } else {

      // iterate through all the routes for a given key
      // and find the route that has the matching regex
      let found = false;
      for (let i = 0; i < subRoutes.length; i++) {
        if (subRoutes[i].regex.exec(url)) {
          let ret = this.parseParameters(subRoutes[i], url);

          if (typeof subRoutes[i].handler === 'function') {
            subRoutes[i].handler(ret);
          } else {
            subRoutes[i].renderRoute(ret);
          }

          found = true;

          break;
        }
      }

      if (!found) {
        // TODO: send to 404 - should never get here
        console.error('TODO: route to 404');
      }
    }
  },

  /**
    Extracts a route's parameter given a route regular expression string
    and a url fragment.  A url fragment is a partial URL.
    @param routeRegex : the regular expression to match a route
    @param urlFragment : partial url to parse
    @return an array that represents the parse order
  */
  extractParameters(routeRegex, urlFragment) {
    let params = routeRegex.exec(urlFragment).slice(1);
    return params.map((param, i) => {
      // Don't decode the search params.
      if (i === params.length - 1) return param || null;
      return param ? decodeURIComponent(param) : null;
    });
  }
}

export default RouterUtils;
