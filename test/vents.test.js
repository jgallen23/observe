var assert = require('assert');
var Vents = require('../');

suite('vents', function() {

  suite('#on', function() {

    test('should add listeners', function() {

      var vents = new Vents();
      var calls = 0;
      vents.on('test', function() {
        calls++;
      });
      vents.on('test', function() {
        calls++;
      });

      vents.emit('test');
      assert.equal(calls, 2);
      
    });

    test('should pass data from emit', function() {

      var vents = new Vents();
      var data;

      vents.on('test', function(arg) {
        data = arg;
      });

      vents.emit('test', 123);

      assert.equal(data, 123); 
      
    });

    test('should pass any amount of data from emit', function() {

      var vents = new Vents();
      var data;

      vents.on('test', function(arg1, arg2) {
        data = arguments;
      });

      vents.emit('test', 123, 456);

      assert.equal(data.length, 2); 
      assert.equal(data[0], 123); 
      assert.equal(data[1], 456); 
      
    });

    test('should return handler', function() {
      var vents = new Vents();

      var handler = vents.on('test', function() {

      });

      assert.equal(typeof handler, 'function');
    });
    
  });

  suite('#emit', function() {
    test('no errors if emitting an event that isn\'t bound', function() {

      var vent = new Vents();
      vent.emit('blah');
      
    });
  });

  suite('#off', function() {

    test('should remove listener', function() {
      var calls = 0;
      var vents = new Vents();

      var handler = vents.on('test', function() {
        calls++;
      });

      vents.emit('test');
      vents.off('test', handler);
      vents.emit('test');
      assert.equal(calls, 1);
    });

    test('if no handler passed, remove all listeners', function() {
      var calls = 0;
      var vents = new Vents();

      var handler = vents.on('test', function() {
        calls++;
      });
      var handler2 = vents.on('test', function() {
        calls++;
      });

      vents.emit('test');
      vents.off('test');
      vents.emit('test');
      assert.equal(calls, 2);
      
    });


    test('if nothing passed, remove all events', function() {
      var calls = 0;
      var vents = new Vents();

      var handler = vents.on('test', function() {
        calls++;
      });
      var handler2 = vents.on('test', function() {
        calls++;
      });

      vents.emit('test');
      vents.off();
      vents.emit('test');
      assert.equal(calls, 2);
      
    });

  });

  suite('#once', function() {

    test('should only fire event once', function() {

      var calls = 0;
      var vents = new Vents();

      vents.once('test', function() {
        calls++;
      });
      vents.emit('test');
      vents.emit('test');

      assert.equal(calls, 1);
      
    });
    
  });

  suite('#hasHandlers', function() {

    test('should return true if something is bound', function() {

      var vents = new Vents();
      vents.on('test', function() {});

      assert.ok(vents.hasHandlers('test'));
    });

    test('should return false if nothing is bound', function() {
      var vents = new Vents();

      assert.equal(vents.hasHandlers('test'), false);
    });
    
  });
  
  
  suite('mixin', function(done) {
    test('should add to object', function(done) {
      var obj = {};
      Vents(obj);
      assert.equal(typeof obj.on, 'function');
      assert.equal(typeof obj.off, 'function');
      obj.on('test', done);
      obj.emit('test');
    });

    test('should add to prototype', function(done) {
      var Class = function() {
        Vents.call(this);
      }

      Vents(Class.prototype);
      var cls = new Class();
      assert.equal(typeof cls.on, 'function');
      assert.equal(typeof cls.off, 'function');
      cls.on('test', done);
      cls.emit('test');
    });
  });
  
});
