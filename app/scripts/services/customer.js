'use strict';

/* jshint unused: false */
app.factory('Customer', function ($firebase, CFG) {
  var customers = $firebase(new Firebase(CFG.FIREBASE_URL + 'customers')).$asObject();
  var customersByName = $firebase(new Firebase(CFG.FIREBASE_URL + 'customersByName')).$asObject();

  var Customer = {
    all: customers,
    allAsArray: function () {
      console.info('allAsArray()');
      var array = [];
      angular.forEach(customers, function(customer) {
        if (customer.deleted) {
          return;
        }
        array.push(customer);
      });
      console.info('allAsArray:', array);
      return array;
    },
/*
    allSorted: function (field, reverse) {
      return function(field, reverse) {
        var array = [];
        angular.forEach(customers, function(customer) {
        array.push(customer);
      });
      array.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if (reverse) {
        array.reverse();
      }
      return array;
    },
*/
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
      delete customer.$id; // you can't set an item with a property starting with '$'... TODO: deepen this fact...
      return customers.$child(customerId).$set(customer);
    },
    find: function (customerId) {
      return customers.$child(customerId);
    },
    findByName: function (customerName) {
      if (customerName) {
        return customersByName[customerName.toLowerCase()];
      }
    },
    delete: function (customer) {
      //console.info('deleting customer', customer);
/*
      if (!customer.$id) {
        console.error('CUSTOMER WITHOUT $ID:', customer);
        var deferred = $q.defer();
        deferred.resolve('No such customer');
        return deferred.promise;
      }
*/
      if (customer.$id) {
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
    }
  };

  return Customer;
});