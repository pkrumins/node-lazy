var Lazy = require('lazy');

exports['buffered lines'] = function (assert) {
    var lazy = Lazy();
    var joined = false;
    lazy.lines
        .forEach(function (line) {
            assert.ok(line instanceof Buffer);
            assert.ok(!line.toString().match(/\n/));
            assert.ok(line.length > 0);
        })
        .join(function (lines) {
            assert.deepEqual(
                lines.map(function (x) { return x.toString() }),
                'foo bar baz quux moo'.split(' ')
            );
            joined = true;
        });
    ;
    
    setTimeout(function () {
        lazy.emit('data', new Buffer('foo\nbar'));
        lazy.emit('data', new Buffer('\nbaz\nquux\nmoo'));
        lazy.emit('data', new Buffer(''));
        lazy.emit('data', new Buffer('\ndoom'));
        lazy.emit('end');
        assert.ok(joined);
    }, 50);
};

exports['string lines'] = function (assert) {
    var lazy = Lazy();
    var joined = false;
    lazy.lines
        .forEach(function (line) {
            assert.ok(line instanceof Buffer);
            assert.ok(!line.toString().match(/\n/));
            assert.ok(line.length > 0);
        })
        .join(function (lines) {
            assert.deepEqual(
                lines.map(function (x) { return x.toString() }),
                'foo bar baz quux moo'.split(' ')
            );
            joined = true;
        });
    ;
    
    setTimeout(function () {
        lazy.emit('data', 'foo\nbar');
        lazy.emit('data', '\nbaz\nquux\nmoo');
        lazy.emit('data', '');
        lazy.emit('data', '\ndoom');
        lazy.emit('end');
        assert.ok(joined);
    }, 50);
};
