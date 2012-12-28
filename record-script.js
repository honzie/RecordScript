// Prameters and defaults
var recordScript = {
  RESERVED_KEYWORDS: ['index', 'delete', 'update', 'created_at', 'updated_at']
};

// Instantiates a new RecordScript object.
// @param name: String, matching the name of the base class to look up
var Record = function (name) {

  // CONSTANTS (Well, JavaScript, so variables we don't intend to mutate)

  // Constant used to create a new class
  var NEW_CLASS = {next: 0, indices: []};

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
  // TODO: add checks for reserved keywords
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
      this.key = properties.key;
    }

    this.updated_at = getTime();

    save();
  };

  // Attaches necessary functions to delete and update to a record object or object
  // containing record objects
  // todo: combine this and prepRecord, maybe
  var attachControls = function (record, index) {
    // If no record found, return null
    if (!record) {
      return null;
    }

    record.index = index;
    record.delete = remove;
    record.update = update;
    return record;
  }

  var prepRecord = function (index) {
    var record = records[index];

    return attachControls(record, index);
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

  this.where = function (criteria) {
    
  };

};
