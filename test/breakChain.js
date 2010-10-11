var Lazy = require('lazy');
var expresso = expresso;

function range(i, j) {
    var r = [];
    for (;i<j;i++) r.push(i);
    return r;
}

exports['breakChain'] = function (assert) {
    var lazy = new Lazy;
    var joinExecuted = 0;
    var filterExecuted = 0;
    lazy
        .filter(function (x) {
            filterExecuted++;
            return x % 2 == 0;
        })
        .take(2)
        .join(function (xs) {
            joinExecuted++;
            assert.deepEqual(xs, [0, 2]);
        });

    range(0,10).forEach(function (x) {
        lazy.emit('data', x);
    });
    lazy.emit('end');

    assert.equal(joinExecuted, 1);
    assert.equal(filterExecuted, 5);
}

