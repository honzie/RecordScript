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

When you create a new record, two timestamps are added by default, one tracking creation time and one tracking
time last updated. All times are tracked as number of milliseconds since 1970.

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

### Getting properties from objects

After receiving a record object, extracting properties is straightforward:

    me = people.first();
    me.id;                 // Returns the id associated with the first record
    me.name;               // In this case, would return 'Honzie'

This works for all records returned, whether from a find or a where query.

## Where

You can query objects by their parameters. Search criteria is passed in as an object, where the
key is the field name and the value is the expected value.

    people.where({"state": "WA"});  // Returns all people records where the value of state is 'WA'
    people.where({"id": 0});        // Querying by ID is also possible

Where also can take a second argument, which is a series of query limitations. The two types of
limits possible are limit and select.

Limit specifies the maximum number of records to return.

    people.where({"state": "NY"}, {"limit": 10});  // Returns the first 10 records with 'NY' as state

Select specifies the field or fields to return. This can be useful if you know you only want to
use a limited number of fields. This can either be a string or array of strings.

    people.where({"state": "NY"}, {"select": "state"});  // Returns records with only the state
    people.where({"state": "NY"}, {"select": ["state", "name"]});  // Returns records with state and name

In these records, you still get the id of the record, which is passed through regardless. Also
included are both the update and delete methods.

Updating Records
------------

Updating a record is as simple as passing in an object with fields and values to update the record
with.

    var me = people.first();
    me.update({"name": "Hans"});

Calling udpate automatically saves the data to local storage.

Deleting Records
------------

To delete a record, call delete on it:

    var me = people.first();
    me.delete();

Deleting takes effect immediately.

Limitations
------------

### LocalStorage Limitations

RecordScript currently only works with LocalStorage, which is supported in modern browsers including IE7+.
LocalStorage is limited to 5mb of storage per domain. Internet Explorer has a method to query how much
space is left, but other browsers are currently (as of Winter, 2012/2013) still lacking this feature.

LocalStorage sticks around the user's browser until the user clears it or a script on your domain clears
either all or part of LocalStorage. Unlike cookies, there is no expiration date.

### Used Keywords

Although RecordScript was designed to allow for almost any field names to be chosen, a few keywords are
used by the base code, and shouldn't be used for field names. This list includes:

* id
* delete
* udpate
* created_at
* updated_at
