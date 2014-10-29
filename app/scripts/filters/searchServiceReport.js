'use strict';

app.filter('searchServiceReport', function () {
  return function(servicereports, customersById, searched) {
    var matching = [];
    // check if input matches current search
    if (servicereports && searched) {
       var regex = new RegExp('.*' + searched + '.*', 'ig');
       for (var key in servicereports) {
        var servicereport = servicereports[key];
        var customer = servicereports[key].customerId ? customersById[servicereports[key].customerId] : null;
        if (
          (
            regex.test(servicereport.dateIn) ||
            regex.test(servicereport.notes)
          ) || (
            customer && (
              regex.test(customer.name) ||
              regex.test(customer.address)
            )
          )
        ) {
          matching.push(servicereports[key]);
        }
      }
      return matching;
    } else {
      return servicereports;
    }    
  };
});