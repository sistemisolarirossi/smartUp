'use strict';

/* jshint unused: false */
app.factory('Customer', function ($firebase, CFG, User, $q) {
  // N.B.: User injection is necessary to mantain current user across hard page loads...
  var ref = new Firebase(CFG.FIREBASE_URL + 'customers');
  var customers = $firebase(ref);
  var refByName = new Firebase(CFG.FIREBASE_URL + 'customersByName');
  var customersByName = $firebase(refByName);

  var Customer = {
    all: customers,
    create: function (customer) {
      return customers.$add(customer).then(function (ref) {
        var customerId = ref.name();
        customersByName.$child(customer.name.toLowerCase()).$set(customerId);
        console.info('customersByName:', customersByName);
        return customerId;
      });
    },
    set: function(customerId, customer) {
      var oldname = customers.$child(customerId).name;
      if (customer.name !== oldname) {
        customersByName.$remove(oldname);
      }
      console.log('set id 1:', customerId);
      customersByName.$child(customer.name.toLowerCase()).$set(customerId);
      delete customer.$id; // you can't set an item with a property starting with '$'... TODO: deepen this fact...
      return customers.$child(customerId).$set(customer);
    },
    find: function (customerId) {
      console.log('Info:', customers.$child(customerId));
      return customers.$child(customerId);
    },
    findByName: function (customerName) {
      if (customerName) {
        return customersByName[customerName.toLowerCase()];
      }
    },
    delete: function (customer) {
      //console.info('deleting customer', customer);
      if (!customer.name) {
        var deferred = $q.defer();
        deferred.resolve('NO SUCH CUSTOMER ID');
        return deferred.promise;
      }
      //customer.deleted = true;
      return customers.$child(customer.$id).$child('deleted').$set(true).then(
        function() {
          console.info('remove - then - success', customer);
          customersByName.$remove(customer.name.toLowerCase());
          return null;
        },
        function(error) {
          console.info('remove - then - error:', error.code);
          return error.code;
        }
      );
    }
  };

  return Customer;
});