'use strict';
 
app.controller('CustomersCtrl', function ($scope, $rootScope, $location, CFG, Customer) {

  $rootScope.formLabel = 'Customers';
  $scope.customer = {};
  $scope.customers = Customer.all;

  $scope.CFG = CFG; // to access CFG from view
  /*
  if ($location.path() === '/customers') { // to handle routes like "/customers:$id"
    $scope.customers = Customer.all;
  }
  */

  $scope.initCustomer = function () {
    $scope.customer.name = null;
    $scope.customer.cfpiva = null;
    $scope.customer.address = null;
    $scope.customer.phone = null;
    $scope.customer.email = null;
    $scope.customer.dateCreation = null;
  
    $scope.formAddEditSubmitted = false;
    $scope.currentId = null;
    $scope.addMode = false;
    $scope.editMode = false;  
    $scope.printMode = false;
    $scope.orderby = 'name';

    $scope.autocompleteAddressResult = '';
    $scope.autocompleteAddressOptions = null;
    $scope.autocompleteAddressDetails = '';
  };

  $scope.submitCustomer = function (valid) {
    $scope.formAddEditSubmitted = true; // allow validation errors to be shown
    if (!valid) {
      return;
    }

    $scope.customer.dateCreation = new Date(); // set customer creation date

    if ($scope.editMode) {
      Customer.set($scope.currentId, $scope.customer).then(function () {
      });
    }
    if ($scope.addMode) {
      Customer.create($scope.customer).then(function (/*customerId*/) {
      });
    }
    $scope.addMode = $scope.editMode = false;
    $scope.formAddEditSubmitted = false; // forbid validation errors to be shown until next submission
  };

  $scope.cancelCustomer = function () {
    $scope.initCustomer();
  };

/*
  $scope.deleteCustomerById = function (customerId) { // TODO: do we need this?
    Customer.delete(customerId);
    var id = customer.$id;
    Customer.delete(id);
  };
*/

  $scope.deleteCustomer = function (customer) {
    var id = customer.$id;
    Customer.delete(id);
  };

  $scope.addCustomer = function () {
    $scope.initCustomer();
    $scope.addMode = true;
  };

  $scope.editCustomer = function (customer) {
    if (!$scope.editMode) {
      var id = customer.$id;
      $scope.currentId = id;
      $scope.customer = Customer.find(id);
      $scope.editMode = true;
    } else {
      $scope.editMode = false;
    }
  };

/*
  $scope.findCustomerName = function (name) {
    if ($scope.customersByName[name]) {
      return $scope.customersByName[name]; // return customer's id
    }
  };
*/
  $scope.preprintCustomer = function (customer) {
    var id = customer.$id;
    if (!$scope.printMode) {
      $scope.currentId = id;
      $scope.customer = Customer.find(id);
      console.info('Preprint $scope.customer:', id, $scope.customer);
      $scope.printMode = true;
    } else {
      $scope.printMode = false;
    }
  };

  $scope.printCustomer = function () {
    if ($scope.printMode) {
      $scope.print();
      window.onafterprint = function () {
        console.log('Printing dialog closed...');
        $scope.printMode = false;
        $scope.$apply();
      };
    }
  };

  $scope.print = function () {
    setTimeout(function () {
      window.print();
    }, 0);
  };

  /*
  $scope.resetCustomerSelected = function () {
    $scope.customerSelected = '';
  };
  */

  /*
  $scope.match = function (str, pattern) {
    var regex = new RegExp(pattern, 'g');
    return str.match(regex);
  };
  */

  $scope.initCustomer();
});