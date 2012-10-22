var assert = require('assert');
var Subs = require('../');

suite('subs', function() {

  suite('#on', function() {

    test('should add listeners', function() {

      var subs = new Subs();
      var calls = 0;
      subs.on('test', function() {
        calls++;
      });
      subs.on('test', function() {
        calls++;
      });

      subs.emit('test');
      assert.equal(calls, 2);
      
    });

    test('should pass data from emit', function() {

      var subs = new Subs();
      var data;

      subs.on('test', function(arg) {
        data = arg;
      });

      subs.emit('test', 123);

      assert.equal(data, 123); 
      
    });

    test('should pass any amount of data from emit', function() {

      var subs = new Subs();
      var data;

      subs.on('test', function(arg1, arg2) {
        data = arguments;
      });

      subs.emit('test', 123, 456);

      assert.equal(data.length, 2); 
      assert.equal(data[0], 123); 
      assert.equal(data[1], 456); 
      
    });

    test('should return handler', function() {
      var subs = new Subs();

      var handler = subs.on('test', function() {

      });

      assert.equal(typeof handler, 'function');
    });

    test('pass in 3rd param to set context', function() {

      var Class = function() {
        this.subs = new Subs();

        this.subs.on('event', this.method, this);
      }
      Class.prototype.method = function(val) {
        this.methodCalled = true;
        this.methodContext = this;
        this.methodVal = val;
      }

      var cls = new Class();
      cls.subs.emit('event', 123);

      assert.equal(cls.methodCalled, true);
      assert.equal(cls.methodContext, cls);
      assert.equal(cls.methodVal, 123);

    });
    
  });

  suite('#emit', function() {
    test('no errors if emitting an event that isn\'t bound', function() {

      var vent = new Subs();
      vent.emit('blah');
      
    });
  });

  suite('#off', function() {

    test('should remove listener', function() {
      var calls = 0;
      var subs = new Subs();

      var handler = subs.on('test', function() {
        calls++;
      });

      subs.emit('test');
      subs.off('test', handler);
      subs.emit('test');
      assert.equal(calls, 1);
    });

    test('if no handler passed, remove all listeners', function() {
      var calls = 0;
      var subs = new Subs();

      var handler = subs.on('test', function() {
        calls++;
      });
      var handler2 = subs.on('test', function() {
        calls++;
      });

      subs.emit('test');
      subs.off('test');
      subs.emit('test');
      assert.equal(calls, 2);
      
    });


    test('if nothing passed, remove all esubs', function() {
      var calls = 0;
      var subs = new Subs();

      var handler = subs.on('test', function() {
        calls++;
      });
      var handler2 = subs.on('test', function() {
        calls++;
      });

      subs.emit('test');
      subs.off();
      subs.emit('test');
      assert.equal(calls, 2);
      
    });

  });

  suite('#once', function() {

    test('should only fire event once', function() {

      var calls = 0;
      var subs = new Subs();

      subs.once('test', function() {
        calls++;
      });
      subs.emit('test');
      subs.emit('test');

      assert.equal(calls, 1);
      
    });

    test('should return fn', function() {

      var subs = new Subs();
      var fn = function() { };

      var ret = subs.once('test', fn);

      assert.equal(typeof ret, 'function');
      
    });

    test('should not be called if off is called before', function() {

      var subs = new Subs();
      var fn = function() { };

      var ret = subs.once('test', fn);
      subs.off('test', ret);

      var called = 0;
      subs.emit('test');

      assert.equal(called, 0);
      
    });

    test('should pass data from emit', function() {

      var subs = new Subs();
      var data;

      subs.once('test', function(arg) {
        data = arg;
      });

      subs.emit('test', 123);

      assert.equal(data, 123); 
      
    });

    test('should pass any amount of data from emit', function() {

      var subs = new Subs();
      var data;

      subs.once('test', function(arg1, arg2) {
        data = arguments;
      });

      subs.emit('test', 123, 456);

      assert.equal(data.length, 2); 
      assert.equal(data[0], 123); 
      assert.equal(data[1], 456); 
      
    });

    test('pass in 3rd param to set context', function() {

      var Klass = function() {
        this.subs = new Subs();

        this.subs.once('event', this.method, this);
      }
      Klass.prototype.method = function(val) {
        this.methodCalled = true;
        this.methodContext = this;
        this.methodVal = val;
      }

      var cls = new Klass();
      cls.subs.emit('event', 123);

      assert.equal(cls.methodCalled, true);
      assert.equal(cls.methodContext, cls);
      assert.equal(cls.methodVal, 123);

    });
    
  });

  suite('#hasHandlers', function() {

    test('should return true if something is bound', function() {

      var subs = new Subs();
      subs.on('test', function() {});

      assert.ok(subs.hasHandlers('test'));
    });

    test('should return false if nothing is bound', function() {
      var subs = new Subs();

      assert.equal(subs.hasHandlers('test'), false);
    });
    
  });
  
  
  suite('mixin', function(done) {
    test('should add to object', function(done) {
      var obj = {};
      Subs(obj);
      assert.equal(typeof obj.on, 'function');
      assert.equal(typeof obj.off, 'function');
      obj.on('test', done);
      obj.emit('test');
    });

    test('should add to prototype', function(done) {
      var Class = function() {
        Subs.call(this);
      }

      Subs(Class.prototype);
      var cls = new Class();
      assert.equal(typeof cls.on, 'function');
      assert.equal(typeof cls.off, 'function');
      cls.on('test', done);
      cls.emit('test');
    });
  });
  
});
