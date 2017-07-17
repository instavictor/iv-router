(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("IVRouter", [], factory);
	else if(typeof exports === 'object')
		exports["IVRouter"] = factory();
	else
		root["IVRouter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var RouterUtils = {

  /**
    Extracts the slug i.e. the key of a url.  
    The key is defined by the text before the first '/' in the URL.
     e.g. 'home/stuff' - "home" is the key
    e.g. 'media' - "media" is the key
    e.g. '/media' - this is invalid
  */
  extractSlug: function extractSlug(url) {
    var slashIndex = url.indexOf('/');
    var keyLength = slashIndex === -1 ? url.length : slashIndex;
    var key = url.substring(0, keyLength) || null;

    return key;
  },


  /**
    Converts a given route url string to a regular expression
    @return regex of route url
  */
  convertRouteToRegex: function convertRouteToRegex(route) {
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g;
    var splatParam = /\*\w+/g;
    route = route.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function (match, optional) {
      return optional ? match : '([^/?]+)';
    }).replace(splatParam, '([^?]*?)');
    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
  },


  /**
    Parses a route given a partial url.  The route must have a regex attached to it
    to help destruct the url into a keyed JSON object that matches the route definition.
    @param route : the route object to parse for params
    @param urlFragment : the partial URL to parse
    @return JSON that matches the descriptors
  */
  parseParameters: function parseParameters(route, urlFragment) {

    var params = this.extractParameters(route.regex, urlFragment);

    // split ids
    var ids = route.keys.split('/:');
    if (ids.length > 1) {
      ids.shift();
    }

    // assemble JSON object path
    var ret = {
      query: {}
    };
    ids.forEach(function (id, i) {
      ret[id] = params[i];
    });

    // check for any query params
    var queryParams = params[params.length - 1];
    if (queryParams) {
      var tmpParams = queryParams.split('&');

      tmpParams.forEach(function (queryParam) {
        var tmp = queryParam.split('=');
        ret.query[tmp[0]] = tmp[1] || '';
      });
    }

    return ret;
  },


  /**
    Given an array of subroutes and a url,
    call the handler that is to handle the subroute that matches the url
  */
  processRoute: function processRoute(subRoutes, url) {

    // if no routes exist, then send to 404
    if (!subRoutes) {
      // TODO: send to 404
      console.error('TODO: route to 404');
      return;
    }

    // iterate through all the routes for a given key
    // and find the route that has the matching regex
    for (var i = 0; i < subRoutes.length; i++) {
      console.log(subRoutes[i]);
      if (subRoutes[i].regex.exec(url)) {
        var ret = this.parseParameters(subRoutes[i], url);

        subRoutes[i].handler(ret);
        return;
      }
    }

    // TODO: send to 404
    console.error('TODO: route to 404');
  },


  /**
    Extracts a route's parameter given a route regular expression string
    and a url fragment.  A url fragment is a partial URL.
    @param routeRegex : the regular expression to match a route
    @param urlFragment : partial url to parse
    @return an array that represents the parse order
  */
  extractParameters: function extractParameters(routeRegex, urlFragment) {
    var params = routeRegex.exec(urlFragment).slice(1);
    return params.map(function (param, i) {
      // Don't decode the search params.
      console.log('Search param: ');
      console.log(param);
      if (i === params.length - 1) return param || null;
      return param ? decodeURIComponent(param) : null;
    });
  }
};

exports.default = RouterUtils;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Router = __webpack_require__(0);

var _Router2 = _interopRequireDefault(_Router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IVRouter = function () {

  /**
    Options are the main DEEPLINKABLE route paths e.g.
    "home": Controller.method
    "media/:id": Controller.method
    "media/:id/:stuff": Controller.method
    "paywall": Controller.method
  */
  function IVRouter(routes) {
    var _this = this;

    _classCallCheck(this, IVRouter);

    this._history = [];
    this._routes = {};

    // route keys are the strings passed in from the client that define the routes
    var routeKeys = Object.keys(routes);
    for (var i = 0; i < routeKeys.length; i++) {

      // extract the key from the url
      var key = _Router2.default.extractSlug(routeKeys[i]);

      if (key) {
        // if there is no existing [] for that route key, then create a []
        if (!this._routes[key]) {
          this._routes[key] = [];
        }

        // use the key as a lookup and push into it
        // 1 - the route's sub keys
        // 2 - a regex to match the route
        // 3 - a handler function to handle the route
        this._routes[key].push({
          keys: routeKeys[i],
          regex: _Router2.default.convertRouteToRegex(routeKeys[i]),
          handler: routes[routeKeys[i]]
        });
      }
    }

    console.log(this._routes);

    window.onhashchange = function (state) {
      _this.checkHash(state);
    };

    this.checkHash(true);
  }

  _createClass(IVRouter, [{
    key: 'checkHash',
    value: function checkHash(e) {
      var hash = window.location.hash ? window.location.hash.slice(1) : '';

      if (e) {
        // extract the key from the url.  The key is the "slug"
        var key = _Router2.default.extractSlug(hash);

        // use the key to get the list of sub routes
        var subRoutes = this._routes[key];

        if (e.newURL !== e.oldURL) {
          console.log('navigate to hash: ' + hash);
          _Router2.default.processRoute(subRoutes, hash);
        } else if (e === true) {
          _Router2.default.processRoute(subRoutes, hash);
        }
      }
    }
  }, {
    key: 'navigateTo',
    value: function navigateTo(url) {
      console.log('navigating to: ' + url);
      window.location.hash = url;
    }
  }, {
    key: 'navigateBack',
    value: function navigateBack() {
      window.history.back();
    }
  }]);

  return IVRouter;
}();

exports.default = IVRouter;

/***/ })
/******/ ]);
});