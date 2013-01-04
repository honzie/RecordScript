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



Updating Records
------------

Deleting Records
------------
