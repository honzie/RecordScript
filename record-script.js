// Instantiates a new RecordScript object.
// @param name: String, matching the name of the base class to look up
var Record = function (name) {

  // CONSTANTS (Well, JavaScript, so variables we don't intend to mutate)

  // Constant used to create a new class
  var NEW_CLASS = {next: 0, indices: []};
  var RESERVED_KEYWORDS = ['id', 'delete', 'update', 'created_at', 'updated_at'];

  // PRIVATE FUNCTIONS

  // Returns the current time in ms. Wrapped as own function for future
  // support of browsers that don't support Date.now() but do support
  // local storage (i.e. IE7/8)
  var getTime = function () {
    return Date.now();
  };

  // Gets the records for a given name. If this is null, creates a new RecordScript object
  // so we can write to it.
  var load = function () {
    return JSON.parse(localStorage.getItem(name)) || NEW_CLASS;
  };

  // Saves any changes to the records to local storage
  var save = function () {
    localStorage.setItem(name, JSON.stringify(records));
  };

  // Deletes a record
  var remove = function () {
    records.indices.splice(records.indices.indexOf(this.index), 1);
    delete records[this.index];
    save();
  };

  // Updates a record, using the properties supplied to override or supplement
  // existing properties
  var update = function (properties) {
    for (key in properties) {
      this[key] = properties[key];
    }

    this.updated_at = getTime();
    save();
  };

  // Strips a record down to only the fields specified, and returns it.
  // Fields can be a string or array of strings
  var stripRecord = function (record, fields) {
    var strippedRecord = {};

    if (typeof fields === 'string') {
      strippedRecord[fields] = record[fields];
    } else {
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        strippedRecord[field] = record[field];
      }
    }

    return strippedRecord;
  };

  // Attaches necessary functions to delete and update to a record object or object
  // containing record objects
  var prepRecord = function (record, id) {
    // If no record found, return null
    if (!record) {
      return null;
    }

    record.id = id;
    record.delete = remove;
    record.update = update;
    return record;
  }

  var prepRecordById = function (id) {
    return prepRecord(records[id], id);
  }

  // VARIABLES

  // The records, to be read and saved
  var records = load();

  // PUBLIC FUNCTIONS

  // Returns an integer representing the number of records
  this.count = function () {
    return records.indices.length;
  };

  // Adds a new record to the class
  this.new = function (properties) {
    // Add created at and updated at
    var time = getTime();
    properties = properties || {};
    properties.created_at = time;
    properties.updated_at = time;

    // Assigns the next index to the properties input, then increments the next index
    records[records.next] = properties;
    records.indices.push(records.next);
    records.next++;
    save();
  };

  // Returns records based on criteria, which can either be a command phrase, a single id,
  // or an array of IDs
  this.find = function (criteria) {
    if (criteria === 'all') {
      criteria = records.indices;
    } else if (criteria === 'first') {
      criteria = records.indices[0];
    } else if (criteria === 'last') {
      criteria = records.indices[records.indices.length - 1];
    }

    if (typeof criteria === 'number') {
      return prepRecord(criteria);
    } else if (Array.isArray(criteria)) {
      var foundRecords = [];

      for (var i = 0; i < criteria.length; i++) {
        foundRecords.push(prepRecord(criteria[i]));
      }

      return foundRecords;
    } else {
      return null;
    }
  };

  // Returns the first record
  this.first = function () {
    return this.find('first');
  }

  // Returns the last record
  this.last = function () {
    return this.find('last');
  }

  // Allows for queries of local storage database based on a criteria passed in. The criteria
  // should be an object, with the keys being parameter names and the value being values
  // to match.
  //
  // params is an optional argument that contains any of the following in a map
  // limit: The maximum number of records to return
  // only: The names of the fields to return in the record. Can be a string or an array of strings
  this.where = function (criteria, params) {
    var foundRecords = [];
    var searchIndices = records.indices;

    params = params || {};

    // Loop through the records, or at least enough to satisfy the limit requirement
    for (var i = 0; i < searchIndices.length && (!params.limit || foundRecords.length < params.limit); i++) {
      var id = searchIndices[i];
      var record = records[id];
      var found = true;

      // Loop through each criteria. If a single one does not match, move on
      for (field in criteria) {
        if (record[field] !== criteria[field]) {
          found = false;
          break;
        }
      }

      // If the record is a match to the criteria, then push it into the foundRecords.
      // If a criteria of fields to return was set with an 'only' param, only return those fields
      if (found) {
        if (params.only) {
          foundRecords.push(prepRecord(stripRecord(record, params.only), id));
        } else {
          foundRecords.push(prepRecord(record, id));
        }
      }
    }

    return foundRecords;
  };
};
