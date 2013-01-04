RecordScript
============

RecordScript is an Active Record inspired library that reads, writes, and queries local storage.

Including RecordScript
------------

Download the JavaScript file and include it in your website, either by including it in your existing
.js bundle, or calling it on its own.

Initializing RecordScript
------------

At any point after the RecordScript JS is included on your page, you can create a new RecordScript object.
You'll probably want to create one RecordScript object for each type of data on your page or in your app.

For example, if you're coding an address book, you may want to initialize a set of records for people:

    var people = new Record('people');

Creating new Records
------------

To create new records, simply call 'new' on your RecordScript object, passing in the data you want to save
as an object. Sometimes, you may want to create an object as a variable and then pass it into new, however
this is optional.

    var me = {
      "name": "Honzie",
      "website": "http://hanssprecher.com",
      "state": "WA"
    };
    people.new(me);

Querying Records
------------

You can query multiple things about your records. In general, this is made to match the ActiveRecord patterns
used in Rails relatively well.

One big difference is that all functions in JS have to be invoked, so you have to use parens '()', where you
may not have to in Ruby. Another difference is that parameters are passed in as objects using loose JSON
formatting, instead of using hash rockets.

## Count

To see how many records you have, call count:

    people.count()

## Find

You can find records by a keyword, an id, or an array of ids. The keywords available in RecordScript are
'all', 'first' and 'last'.

    people.find('all');   // Returns an array of all people records
    people.find('first'); // Returns the first record
    people.find('last');  // Returns the last record
    people.find(4);       // Returns the person with a record with an ID of 4
    people.find(4, 8);    // Returns an array of people records where the ID is either 4 or 8

If no record is found, null is returned.

For all, first and last, there are aliases to the above functions off of the base object:

    people.all();
    people.first();
    people.last();

## Getting properties from objects

After receiving a record object, extracting properties is straightforward:

    me = people.first();
    me.id;                 // Returns the id associated with the first record
    me.name;               // In this case, would return 'Honzie'

Updating Records
------------

Deleting Records
------------
