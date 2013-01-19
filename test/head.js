var assert = require('assert');
var Lazy = require('..');
var expresso = expresso;

exports['head'] = function () {
    var lazy = new Lazy;
    var executed = 0;
    var expect = function(n) {
        return function(x) {
            executed++;
            assert.eql(x, n);
        }
    }

    // callback should only execute once.
    lazy.head(expect(12));
    [12, 13, 14].forEach(function (x) {
        lazy.emit('data', x);
    });
    assert.equal(executed, 1);

    // multiple calls to head leave the lazy list unchanged.
    lazy.head(expect(123));
    lazy.head(expect(123));
    lazy.head(expect(123));
    lazy.join(expect([123, 456, 789]));
    [123, 456, 789].forEach(function(x) {
        lazy.emit('data', x);
    })
    assert.equal(executed, 4);
    lazy.emit('end');
    assert.equal(executed, 5);
}

