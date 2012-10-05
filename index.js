
var Vents = function(obj) {
  if (obj) {
    obj._handlers = {};
    for (var key in Vents.prototype) {
      obj[key] = Vents.prototype[key];
    }
    return obj;
  }
  this._handlers = {};
}

Vents.prototype.on = function(event, fn) {
  if (!this._handlers[event]) {
    this._handlers[event] = [];
  }

  this._handlers[event].push(fn);

  return fn;

}

Vents.prototype.emit = function() {
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

Vents.prototype.off = function(event, handler) {
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

Vents.prototype.once = function(event, handler) {
  var self = this;
  var onceHandler = this.on(event, function(data) {
    handler(data);
    self.off(event, onceHandler);
  });
}

Vents.prototype.hasHandlers = function(event) {
  return !! this._handlers[event];

}

if (typeof window === "undefined") {
  module.exports = Vents;
}
