var assert = require('assert');
var Lazy = require('..');
var EventEmitter = require('events').EventEmitter;

var testsToRunDelimiters = {
    "null character": '\0',
    "letter 'X'": 'X',
    "letters 'X', 'Y', and 'Z'": 'XYZ',
    "Windows newlines": '\r\n',
    "Unix newlines": '\n'
};

Object.keys(testsToRunDelimiters).forEach(function (testName) {

    var delimiters = testsToRunDelimiters[testName];

    exports['delimiter '+testName+' with Buffers'] = function () {
        var lazy = Lazy();
        var joined = false;
        lazy.delimit(delimiters)
            .forEach(function (line) {
                assert.ok(line instanceof Buffer);
                assert.ok(line.length > 0);
                for (var i = 0; i < delimiters.length; i++) {
                    assert.ok(line.toString().indexOf(delimiters[i]) === -1);
                }
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
            lazy.push(new Buffer('foo'+delimiters+'bar'));
            lazy.push(new Buffer(delimiters+'baz'+delimiters+'quux'+delimiters+'moo'));
            lazy.push(new Buffer(''));
            lazy.push(new Buffer(delimiters+'doom'));
            lazy.end();
            assert.ok(joined);
        }, 50);
    }

    exports['delimiter '+testName+' with strings'] = function () {
        var lazy = Lazy();
        var joined = false;
        lazy.delimit(delimiters)
            .forEach(function (line) {
                assert.ok(line instanceof Buffer);
                assert.ok(line.length > 0);
                for (var i = 0; i < delimiters.length; i++) {
                    assert.ok(line.toString().indexOf(delimiters[i]) === -1);
                }
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
            lazy.push('foo'+delimiters+'bar');
            lazy.push(delimiters+'baz'+delimiters+'quux'+delimiters+'moo');
            lazy.push('');
            lazy.push(delimiters+'doom');
            lazy.end();
            assert.ok(joined);
        }, 50);
    };


    exports['delimiter '+testName+' ends stream'] = function () {
        var to = setTimeout(function () {
            assert.fail('never finished');
        }, 2500);

        var em = new EventEmitter;
        var i = 0;
        var lines = [];
        Lazy(em).delimit(delimiters).forEach(function (line) {
            i ++;
            lines.push(line);
            if (i == 2) {
                clearTimeout(to);
                assert.eql(lines.map(String), [ 'foo', 'bar' ]);
            }
        });

        setTimeout(function () {
            em.emit('data', 'fo');
        }, 100);

        setTimeout(function () {
            em.emit('data', 'o'+delimiters+'bar');
        }, 150);

        setTimeout(function () {
            em.emit('end');
        }, 200);
    };

});
