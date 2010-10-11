var Lazy = require('lazy');
var expresso = expresso;

function range(i, j) {
    var r = [];
    for (;i<j;i++) r.push(i);
    return r;
}

exports['filter'] = function (assert) {
    var lazy = new Lazy;
    var data = [];
    var executed = false;
    lazy.join(function (xs) {
        assert.deepEqual(xs, range(0,10));
        executed = true;
    });

    range(0,10).forEach(function (x) {
        lazy.emit('data', x);
    });
    lazy.emit('end');

    assert.ok(executed, 'join didn\'t execute');
}

