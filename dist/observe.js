/*!
 * observe - an event lib for node and browser
 * v0.0.7
 * https://github.com/jgallen23/observe
 * copyright  2012
 * MIT License
*/

//built with clientside 0.4.0 https://github.com/jgallen23/clientside
if (typeof __cs == 'undefined') {
  var __cs = { 
    map: {}, 
    libs: {},
    r: function(p) {
      var mod = __cs.libs[__cs.map[p]];
      if (!mod) {
        throw new Error(p + ' not found');
      }
      return mod;
    }
  };
  window.require = __cs.r;
}
__cs.map['currie'] = 'cs6c6bca62';

//currie.js
__cs.libs.cs6c6bca62 = (function(require, module, exports) {
var currie = function(fn, scope) {
  var args = [];
  for (var i=2, len = arguments.length; i < len; ++i) {
    args.push(arguments[i]);
  };
  return function() {
    var fnArgs = args.slice(0);
    for (var i = 0, c = arguments.length; i < c; i++) {
      fnArgs.push(arguments[i]);
    }
    fn.apply(scope, fnArgs);
  };
}
module.exports = currie;
return module.exports || exports;
})(__cs.r, {}, {});

//index.js
__cs.libs.cs168726db = (function(require, module, exports) {
var currie = require('currie');
var Observe = function(obj) {
  if (obj) {
    obj._handlers = {};
    for (var key in Observe.prototype) {
      obj[key] = Observe.prototype[key];
    }
    return obj;
  }
  this._handlers = {};
};
Observe.prototype.on = function(event, fn, context) {
  if (!this._handlers[event]) {
    this._handlers[event] = [];
  }
  fn = (context) ? currie(fn, context) : fn;
  this._handlers[event].push(fn);
  return fn;
};
Observe.prototype.emit = function() {
  var args = Array.prototype.slice.call(arguments);
  var event = args.shift();
  if (!this.hasHandlers(event)) {
    return;
  }
  for (var i = 0, c = this._handlers[event].length; i < c; i++) {
    var fn = this._handlers[event][i];
    if (fn) {
      fn.apply(this, args);
    }
  }
};
Observe.prototype.off = function(event, handler) {
  if (arguments.length === 0) {
    this._handlers = {};
    return;
  }
  if (!this.hasHandlers(event)) {
    return;
  }
  if (arguments.length == 1) {
    delete this._handlers[event];
    return;
  }
  var index = this._handlers[event].indexOf(handler);
  if (~index) {
    this._handlers[event].splice(index, 1);
  }
};
Observe.prototype.once = function(event, handler, context) {
  var self = this;
  var onceHandler = this.on(event, function() {
    handler.apply(context, arguments);
    self.off(event, onceHandler);
  });
  return onceHandler;
};
Observe.prototype.hasHandlers = function(event) {
  return !! this._handlers[event];
};
if (typeof module === "object") {
  module.exports = Observe;
}
return module.exports || exports;
})(__cs.r, {}, {});

window['Observe'] = __cs.libs.cs168726db;
__cs.map['Observe'] = 'cs168726db';

