var currie = require('currie');

var Subs = function(obj) {
  if (obj) {
    obj._handlers = {};
    for (var key in Subs.prototype) {
      obj[key] = Subs.prototype[key];
    }
    return obj;
  }
  this._handlers = {};
}

Subs.prototype.on = function(event, fn, context) {
  if (!this._handlers[event]) {
    this._handlers[event] = [];
  }

  fn = (context) ? currie(fn, context) : fn;
  this._handlers[event].push(fn);

  return fn;

}

Subs.prototype.emit = function() {
  var args = Array.prototype.slice.call(arguments);
  var event = args.shift();
  if (!this.hasHandlers(event)) {
    return;
  }

  for (var i = 0, c = this._handlers[event].length; i < c; i++) {
    var fn = this._handlers[event][i];
    fn.apply(this, args);
  }
}

Subs.prototype.off = function(event, handler) {
  if (arguments.length == 0) {
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

}

Subs.prototype.once = function(event, handler, context) {
  var self = this;
  var onceHandler = this.on(event, function() {
    handler.apply(context, arguments);
    self.off(event, onceHandler);
  });
  return onceHandler;
}

Subs.prototype.hasHandlers = function(event) {
  return !! this._handlers[event];

}

if (typeof module === "object") {
  module.exports = Subs;
}
