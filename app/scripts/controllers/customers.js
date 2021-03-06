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
  $scope.$watch('formAddEdit.$valid', function(value) {
    //console.info('form addedit validity is', value);
    $scope.formAddEditValid = value;
  });

  $scope.initCustomer = function () {
    $scope.customer.name = null;
    $scope.customer.cfpiva = null;
    $scope.customer.address = null;
    $scope.customer.phone = null;
    $scope.customer.email = null;
    $scope.customer.dateCreation = null;
  
    $scope.formAddEditValid = false;
    $scope.formAddEditSubmitted = false;
    //$scope.currentId = null;
    $scope.addMode = false;
    $scope.editMode = false;  
    $scope.printMode = false;
    $scope.orderby = 'name';

    $scope.autocompleteAddressResult = '';
    $scope.autocompleteAddressOptions = null;
    $scope.autocompleteAddressDetails = { types : 'establishments' };
  };

  $scope.submitCustomer = function () {
    console.info('sumbit customer');
    $scope.formAddEditSubmitted = true; // allow validation errors to be shown
    if (!$scope.formAddEditValid) {
      return;
    }

    if ($scope.editMode) {
      $scope.customer.lastModify = new Date(); // set customer modify date
      //console.info('sumbit customer in edit mode:', $scope.customer.$id, $scope.customer);
      Customer.set($scope.customer.$id, $scope.customer).then(function () {});
    }
    if ($scope.addMode) {
      $scope.customer.dateCreation = new Date(); // set customer creation date
      //console.info('sumbit customer in add mode:', $scope.customer);
      Customer.create($scope.customer).then(function () {});
    }
    $scope.addMode = $scope.editMode = false;
    $scope.formAddEditSubmitted = false; // forbid validation errors to be shown until next submission
  };

  $scope.cancelCustomer = function () {
    $scope.initCustomer();
    console.log('CANCEL - customer now is empty:', $scope.customer);
  };

  $scope.deleteCustomer = function (customer) {
    console.info('deleteCustomer:', customer);
    Customer.delete(customer).then(
      function(error) {
        if (!error) {
          console.info('deleteCustomer - success');
          toastr.info('Customer deleted');
        } else {
          console.info('deleteCustomer - error', error.replace(/_/, ' '));
          toastr.error('Customer not deleted: ' + error.replace(/_/, ' '));
        }
      }
    );
  };

  $scope.addCustomer = function () {
    $scope.initCustomer();
    $scope.addMode = true;
  };

  $scope.currentUserCanRead = function () {
    //console.info('currentUserCanRead - $rootScope.currentUser:', $rootScope.currentUser);
    if ($rootScope.currentUser) {
      //console.info('currentUserCanRead - currentUser is set');
      //console.info('currentUserCanRead - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.customers) {
        //console.info('currentUserCanRead - currentUser.roles.read.customers:', $rootScope.currentUser.roles.customers.read);
        //console.info('currentUserCanRead - retval:', $rootScope.currentUser.roles.customers.read);
        return $rootScope.currentUser.roles.customers.read;
      } else {
        //console.info('currentUserCanRead - returning FALSE - no customer roles on user', $rootScope.currentUser);
        return false;
      }
    }
    //console.info('currentUserCanRead - returning FALSE');
    return false;
  };

  $scope.currentUserCanWrite = function () {
    //console.info('currentUserCanWrite');
    if ($rootScope.currentUser) {
      //console.info('currentUserCanWrite - currentUser is set');
      //console.info('currentUserCanWrite - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.customers) {
        //console.info('currentUserCanWrite - currentUser.roles.write.customers:', $rootScope.currentUser.roles.customers.write);
        //console.info('currentUserCanWrite - retval:', $rootScope.currentUser.roles.customers.write);
        return $rootScope.currentUser.roles.customers.write;
      } else {
        //console.info('currentUserCanWrite - returning FALSE (no customers roles on user)', $rootScope.currentUser);
        return false;
      }
    }
    //console.info('currentUserCanWrite - returning FALSE');
    return false;
  };

  $scope.editCustomer = function (customer) {
    console.log('EDITCUSTOMER', customer);
    if (!$scope.editMode) {
      var id = customer.$id;
      //$scope.currentId = id;
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
      //$scope.currentId = id;
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