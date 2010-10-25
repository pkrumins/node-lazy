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
        lazy.push(new Buffer('foo\nbar'));
        lazy.push(new Buffer('\nbaz\nquux\nmoo'));
        lazy.push(new Buffer(''));
        lazy.push(new Buffer('\ndoom'));
        lazy.end();
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
        lazy.push('foo\nbar');
        lazy.push('\nbaz\nquux\nmoo');
        lazy.push('');
        lazy.push('\ndoom');
        lazy.end();
        assert.ok(joined);
    }, 50);
};
