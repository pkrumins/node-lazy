var assert = require('assert');
var Lazy = require('..');
var expresso = expresso;

exports['pop'] = function () {
    var lazy = new Lazy;
    var executed = 0;

    var expect = function(n) {
        return function(x) {
            executed++;
            assert.eql(x, n);
        }
    }

    lazy.pop(expect(77))
        .pop(expect(99))
        .join(expect([11, 55, 33]));

    [77, 99, 11, 55, 33].forEach(function (x) {
        lazy.emit('data', x);
    });
    lazy.emit('end');

    assert.equal(executed, 3);
}

