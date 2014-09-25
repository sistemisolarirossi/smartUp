'use strict';

app.filter('searching', function () {
  return function(all, searched) {
    var matching = [];

    // check if input matches current search
    if (all && searched) {
       for (var key in all) {
        if (all[key].name === searched) {
          matching.push(all[key]);
        }
      }
      return matching;
    } else {
      return all;
    }    
  };
});
