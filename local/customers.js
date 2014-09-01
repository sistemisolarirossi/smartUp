'use strict';
 
app.controller('CustomersCtrl', function ($scope, $location, Customer) {

  $scope.customers = Customer.all;
  /*
  if ($location.path() === '/customers') {
    $scope.customers = Customer.all;
  }
  */

  $scope.customerSelected = '';
  $scope.customerIdCurrent = null;

  $scope.customerPlaceholder = { name: '', piva: '', address: '', phone: '', email: '', dateCreation: '', };
  $scope.customer = angular.copy($scope.customerPlaceholder);
  $scope.customerAddMode = $scope.customerEditMode = false;

  $scope.submitCustomer = function () {
    var now = new Date();
    $scope.customer.dateCreation = now;
    if ($scope.customerEditMode) {
      //var customerId = $scope.customerIdCurrent;
      var customer = {};
      for (var fld in $scope.customerPlaceholder) {
        customer[fld] = $scope.customer[fld];
      }
      Customer.set($scope.customerIdCurrent, customer).then(function () {
        $scope.customer = angular.copy($scope.customerPlaceholder);
      });
    }
    if ($scope.customerAddMode) {
      Customer.create($scope.customer).then(function (/*customerId*/) {
        $scope.customer = angular.copy($scope.customerPlaceholder);
      });
    }
    $scope.customerAddMode = $scope.customerEditMode = false;
  };

  $scope.cancelCustomer = function () {
    $scope.customerAddMode = $scope.customerEditMode = false;
    $scope.customer = angular.copy($scope.customerPlaceholder);
  };

  $scope.deleteCustomer = function (customerId) {
    Customer.delete(customerId);
  };

  $scope.editCustomer = function (customerId) {
    if (!$scope.customerEditMode) {
      $scope.customerIdCurrent = customerId;
      $scope.customer = Customer.find(customerId);
      $scope.customerEditMode = true;
    } else {
      $scope.customerEditMode = false;
    }
  };

  $scope.resetCustomerSelected = function () {
    $scope.customerSelected = '';
  };

  $scope.match = function (str, pattern) {
    var regex = new RegExp(pattern, 'g');
    return str.match(regex);
  };

});