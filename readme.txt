This is lazy lists for node.js.

It was written by Peteris Krumins (peter@catonmat.net).
His blog is at http://www.catonmat.net  --  good coders code, great reuse.

------------------------------------------------------------------------------

Table of contents:

  [1]: Introduction
  [2]: Documentation


[1]-Introduction--------------------------------------------------------------

It comes really handy when you need to treat a stream of events like a list.
The best use case currently is returning a lazy list from an asynchronous
function, and having data pumped into it via events. In asynchronous
programming you can't just return a regular list because you don't yet have
data for it. The usual solution so far has been to provide a callback that gets
called when the data is available. But doing it this way you lose the power of
chaining functions and creating pipes, which leads to not that nice interfaces.
(See the 2nd example below to see how it improved the interface in one of my
modules.)

Check out this toy example, first you create a Lazy object:

    var Lazy = require('lazy');

    var lazy = new Lazy;
    lazy
      .filter(function (item) {
        return item % 2 == 0
      })
      .take(5)
      .map(function (item) {
        return item*2;
      })
      .join(function (xs) {
        console.log(xs);
      });

This code says that 'lazy' is going to be a lazy list that filters even
numbers, takes first five of them, then multiplies all of them by 2, and then
calls the join function (think of join as in threads) on the final list.

And now you can emit 'data' events with data in them at some point later,

    [0,1,2,3,4,5,6,7,8,9,10].forEach(function (x) {
      lazy.emit('data', x);
    });

The output will be produced by the 'join' function, which will output the
expected [0, 4, 8, 12, 16].

And here is a real-world example. Some time ago I wrote a hash database for
node.js called node-supermarket (think of key-value store except greater). Now
it had a similar interface as a list, you could .forEach on the stored
elements, .filter them, etc. But being asynchronous in nature it lead to the
following code, littered with callbacks and temporary lists:

    var Store = require('supermarket');

    var db = new Store({ filename : 'users.db', json : true });

    var users_over_20 = [];
    db.filter(
      function (user, meta) {
        // predicate function
        return meta.age > 20;
      },
      function (err, user, meta) {
        // function that gets executed when predicate is true
        if (users_over_20.length < 5)
          users_over_20.push(meta);
      },
      function () {
        // done function, called when all records have been filtered

        // now do something with users_over_20
      }
    )

This code selects first five users who are over 20 years old and stores them
in users_over_20.

But now we changed the node-supermarket interface to return lazy lists, and
the code became:

    var Store = require('supermarket');

    var db = new Store({ filename : 'users.db', json : true });

    db.filter(function (user, meta) {
        return meta.age > 20;
      })
      .take(5)
      .join(function (xs) {
        // xs contains the first 5 users who are over 20!
      });

This is so much nicer!


[2]-Documentation-------------------------------------------------------------

Supports the following operations:

    * lazy.filter(f)
    * lazy.forEach(f)
    * lazy.map(f)
    * lazy.take(n)
    * lazy.takeWhile(f)
    * lazy.bucket(init, f)
    * lazy.lines

------------------------------------------------------------------------------

Have fun being lazy!


Sincerely,
Peteris Krumins
http://www.catonmat.net

