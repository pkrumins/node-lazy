var assert = require('assert');
var Lazy = require('..');
var EventEmitter = require('events').EventEmitter;

exports['buffered lines'] = function () {
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

exports['string lines'] = function () {
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

exports.endStream = function () {
    var to = setTimeout(function () {
        assert.fail('never finished');
    }, 2500);
    
    var em = new EventEmitter;
    var i = 0;
    var lines = [];
    Lazy(em).lines.forEach(function (line) {
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
        em.emit('data', 'o\nbar');
    }, 150);
    
    setTimeout(function () {
        em.emit('end');
    }, 200);
};

exports.emptyLines = function () {
    var lineNumber = 0;
    var em = new EventEmitter;
    var lazy = Lazy(em);
    lazy.lines
      .map(String)
      .forEach(function (line) {
          switch(lineNumber) {
          case 0:
            assert.eql(line, 'line1');
            break;
          case 1:
          case 2:
            assert.eql(line, '');
            assert.eql(line, '');
            break;
          case 3:
            assert.eql(line, 'line4');
            break;
          }
          lineNumber ++;
      });
    em.emit('data', 'line1\n\n\r\nline4');
    em.emit('end');
};
