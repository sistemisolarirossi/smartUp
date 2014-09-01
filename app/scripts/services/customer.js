'use strict';

/* jshint unused: false */
app.factory('Customer', function ($firebase, CFG, User) {
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
      customersByName.$child(customer.name.toLowerCase()).$set(customerId);
      return customers.$child(customerId).$set(customer);
    },
    find: function (customerId) {
      return customers.$child(customerId);
    },
    findByName: function (customerName) {
      return customersByName[customerName.toLowerCase()];
    },
    delete: function (customerId) {
      var customer = Customer.find(customerId);
      customer.deleted = true;
      customersByName.$remove(customer.name.toLowerCase());
      customers.$child(customerId).$set(customer);
    }
  };

  return Customer;
});