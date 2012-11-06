var assert = require('assert');
var Observe = require('../');

suite('observe', function() {

  suite('#on', function() {

    test('should add listeners', function() {

      var observe = new Observe();
      var calls = 0;
      observe.on('test', function() {
        calls++;
      });
      observe.on('test', function() {
        calls++;
      });

      observe.emit('test');
      assert.equal(calls, 2);
      
    });

    test('should pass data from emit', function() {

      var observe = new Observe();
      var data;

      observe.on('test', function(arg) {
        data = arg;
      });

      observe.emit('test', 123);

      assert.equal(data, 123); 
      
    });

    test('should pass any amount of data from emit', function() {

      var observe = new Observe();
      var data;

      observe.on('test', function(arg1, arg2) {
        data = arguments;
      });

      observe.emit('test', 123, 456);

      assert.equal(data.length, 2); 
      assert.equal(data[0], 123); 
      assert.equal(data[1], 456); 
      
    });

    test('should return handler', function() {
      var observe = new Observe();

      var handler = observe.on('test', function() {

      });

      assert.equal(typeof handler, 'function');
    });

    test('pass in 3rd param to set context', function() {

      var Class = function() {
        this.observe = new Observe();

        this.observe.on('event', this.method, this);
      };
      Class.prototype.method = function(val) {
        this.methodCalled = true;
        this.methodContext = this;
        this.methodVal = val;
      };

      var cls = new Class();
      cls.observe.emit('event', 123);

      assert.equal(cls.methodCalled, true);
      assert.equal(cls.methodContext, cls);
      assert.equal(cls.methodVal, 123);

    });
    
  });

  suite('#emit', function() {
    test('no errors if emitting an event that isn\'t bound', function() {

      var vent = new Observe();
      vent.emit('blah');
      
    });
  });

  suite('#off', function() {

    test('should remove listener', function() {
      var calls = 0;
      var observe = new Observe();

      var handler = observe.on('test', function() {
        calls++;
      });

      observe.emit('test');
      observe.off('test', handler);
      observe.emit('test');
      assert.equal(calls, 1);
    });

    test('if no handler passed, remove all listeners', function() {
      var calls = 0;
      var observe = new Observe();

      var handler = observe.on('test', function() {
        calls++;
      });
      var handler2 = observe.on('test', function() {
        calls++;
      });

      observe.emit('test');
      observe.off('test');
      observe.emit('test');
      assert.equal(calls, 2);
      
    });


    test('if nothing passed, remove all eobserve', function() {
      var calls = 0;
      var observe = new Observe();

      var handler = observe.on('test', function() {
        calls++;
      });
      var handler2 = observe.on('test', function() {
        calls++;
      });

      observe.emit('test');
      observe.off();
      observe.emit('test');
      assert.equal(calls, 2);
      
    });

  });

  suite('#once', function() {

    test('should only fire event once', function() {

      var calls = 0;
      var observe = new Observe();

      observe.once('test', function() {
        calls++;
      });
      observe.emit('test');
      observe.emit('test');

      assert.equal(calls, 1);
      
    });

    test('should return fn', function() {

      var observe = new Observe();
      var fn = function() { };

      var ret = observe.once('test', fn);

      assert.equal(typeof ret, 'function');
      
    });

    test('should not be called if off is called before', function() {

      var observe = new Observe();
      var fn = function() { };

      var ret = observe.once('test', fn);
      observe.off('test', ret);

      var called = 0;
      observe.emit('test');

      assert.equal(called, 0);
      
    });

    test('should pass data from emit', function() {

      var observe = new Observe();
      var data;

      observe.once('test', function(arg) {
        data = arg;
      });

      observe.emit('test', 123);

      assert.equal(data, 123); 
      
    });

    test('should pass any amount of data from emit', function() {

      var observe = new Observe();
      var data;

      observe.once('test', function(arg1, arg2) {
        data = arguments;
      });

      observe.emit('test', 123, 456);

      assert.equal(data.length, 2); 
      assert.equal(data[0], 123); 
      assert.equal(data[1], 456); 
      
    });

    test('pass in 3rd param to set context', function() {

      var Klass = function() {
        this.observe = new Observe();

        this.observe.once('event', this.method, this);
      };
      Klass.prototype.method = function(val) {
        this.methodCalled = true;
        this.methodContext = this;
        this.methodVal = val;
      };

      var cls = new Klass();
      cls.observe.emit('event', 123);

      assert.equal(cls.methodCalled, true);
      assert.equal(cls.methodContext, cls);
      assert.equal(cls.methodVal, 123);

    });
    
  });

  suite('#hasHandlers', function() {

    test('should return true if something is bound', function() {

      var observe = new Observe();
      observe.on('test', function() {});

      assert.ok(observe.hasHandlers('test'));
    });

    test('should return false if nothing is bound', function() {
      var observe = new Observe();

      assert.equal(observe.hasHandlers('test'), false);
    });
    
  });
  
  
  suite('mixin', function(done) {
    test('should add to object', function(done) {
      var obj = {};
      Observe(obj);
      assert.equal(typeof obj.on, 'function');
      assert.equal(typeof obj.off, 'function');
      obj.on('test', done);
      obj.emit('test');
    });

    test('should add to prototype', function(done) {
      var Class = function() {
        Observe.call(this);
      };

      Observe(Class.prototype);
      var cls = new Class();
      assert.equal(typeof cls.on, 'function');
      assert.equal(typeof cls.off, 'function');
      cls.on('test', done);
      cls.emit('test');
    });
  });
  
});
