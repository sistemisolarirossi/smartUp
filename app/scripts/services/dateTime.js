'use strict';

app.factory('DateTime', function () {

  // class constructor
  function DateTime(date) {
    if (date === undefined) {
      this.date = new Date();
    }
    if (Object.prototype.toString.call(date) === '[object Date]') { // date is a Date object
      this.date = date;
    } else { // date is not a Date object
      this.date = new Date(date);
    }
  }

  DateTime.prototype.get = function () {
    return this.date;
  };

  DateTime.prototype.addHours = function(h) {
    this.date.setHours(this.date.getHours() + parseInt(h));
  };

  DateTime.prototype.addMinutes = function(m) {
    this.date.setMinutes(this.date.getMinutes() + parseInt(m));
  };

  return DateTime;
});
