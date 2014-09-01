'use strict';
 
app.controller('ServicereportsCtrl', function ($scope, $rootScope, $location, Servicereport, Customer, Auth, DateTime) {
  $rootScope.formLabel = 'Service Reports';

  $scope.servicereport = {};
  $scope.servicereports = Servicereport.all;

  $scope.customersById = {};
  $scope.customers = Customer.all;
  $scope.customers.$on('loaded', function() {
    angular.forEach($scope.customers, function(customer, id) {
      if (typeof customer === 'object') {
        $scope.customersById[id] = customer;
      }
    });
    //console.info($scope.customersById);
  });

  // initialize report operator if user is authenticated
  $scope.$watch(Auth.currentUser, function(user) {
    if (user) {
      $scope.servicereport.operator = $scope.currentUser.username;
    }
  }, true);

  $scope.servicereports.$on('loaded', function() {
    $scope.servicereport.number = Servicereport.getNumberNext();
  });

  $scope.initServicereport = function () {
    //$scope.servicereport.number = null;
    $scope.servicereport.operator = $scope.currentUser ? $scope.currentUser.username : null;
    $scope.servicereport.dateIn = new Date();
    $scope.servicereport.dateOut = $scope.servicereport.dateIn;
    $scope.servicereport.duration = null;
    $scope.servicereport.location = null;
    $scope.servicereport.notes = null;
    $scope.servicereport.dateCreation = null;
  
    $scope.customer = null;
    $scope.formAddEditSubmitted = false;
    $scope.currentId = null;
    $scope.addMode = false;
    $scope.editMode = false;  
    $scope.printMode = false;
    $scope.orderby = '-number';
    $scope.dateInit();
  };

  $scope.submitServicereport = function (valid) {
    $scope.formAddEditSubmitted = true; // allow validation errors to be shown
    if (!valid) {
      return;
    }

    $scope.servicereport.customerId = $scope.customer.$id; // save customer's id
    $scope.servicereport.dateCreation = new Date(); // set report creation date
    $scope.setDateOut();
    //$scope.servicereport.duration = $scope.formatTimeDuration($scope.servicereport.duration);
    if ($scope.editMode) {
      Servicereport.set($scope.currentId, $scope.servicereport).then(function () {
        //$scope.servicereport.number = Servicereport.setNumberNext($scope.servicereport.number);
        //$scope.initServicereport();
      });
    }
    if ($scope.addMode) {
      Servicereport.create($scope.servicereport).then(function (/*servicereportId*/) {
        //$scope.servicereport.number = Servicereport.setNumberNext($scope.servicereport.number);
      });
    }
    $scope.addMode = $scope.editMode = false;
    $scope.formAddEditSubmitted = false; // forbid validation errors to be shown until next submission
  };

  $scope.cancelServicereport = function () {
    if ($scope.addMode) {
      $scope.servicereport.number = Servicereport.resetNumberNext();
    }
    $scope.initServicereport();
  };

  $scope.deleteServicereport = function (servicereport) {
    var id = servicereport.$id;
    Servicereport.delete(id);
  };

  $scope.addServicereport = function () {
    $scope.initServicereport();
    $scope.addMode = true;
    $scope.servicereport.number = Servicereport.setNumberNext();
  };

  $scope.editServicereport = function (servicereport) {
    if (!$scope.editMode) {
      var id = servicereport.$id;
      $scope.currentId = id;
      $scope.servicereport = Servicereport.find(id);
      $scope.customer = Customer.find($scope.servicereport.customerId);
      console.info('EDIT $scope.servicereport:', id, $scope.servicereport);
      $scope.editMode = true;
    } else {
      $scope.editMode = false;
    }
  };

  $scope.preprintServicereport = function (servicereport) {
    var id = servicereport.$id;
    if (!$scope.printMode) {
      $scope.currentId = id;
      $scope.servicereport = Servicereport.find(id);
      $scope.customer = Customer.find($scope.servicereport.customerId);
      console.info('Preprint $scope.servicereport:', id, $scope.servicereport);
      $scope.printMode = true;
    } else {
      $scope.printMode = false;
    }
  };

  $scope.printServicereport = function () {
    if ($scope.printMode) {
      $scope.print();
      window.onafterprint = function () {
        console.log('Printing dialog closed...');
        $scope.printMode = false;
        $scope.$apply();
      };
    }
  };

  $scope.dateInit = function () {
    $scope.dateMin = null;
    $scope.dateMax = null;
    $scope.dateFormat = 'dd MMMM yyyy';
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false
    };
    $scope.hourStep = 1;
    $scope.minuteStep = 1;
    $scope.showMeridian = false;

    $scope.dateDisabled = function(/*date, mode*/) {
      //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      return false;
    };
    $scope.dateOpen = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.dateOpened = true;
    };
    $scope.timeChanged = function() {
      console.info('dateIn without time set:', $scope.servicereport.dateIn);
      console.info('timeChanged:', $scope.timeIn.getHours(), $scope.timeIn.getMinutes());
      $scope.servicereport.dateIn.setHours($scope.timeIn.getHours());
      $scope.servicereport.dateIn.setMinutes($scope.timeIn.getMinutes());
      $scope.servicereport.dateIn.setSeconds(0);
      console.info('dateIn with time set:', $scope.servicereport.dateIn);
    };
  };

  $scope.setDateOut = function () {
    var d = new DateTime($scope.servicereport.dateOut);
    var hhmm = $scope.servicereport.duration.split(':');
    d.addHours(hhmm[0] || 0);
    d.addMinutes(hhmm[1] || 0);
    $scope.servicereport.dateOut = d.get();
  };

/*
  $scope.getCustomerName = function (customerId) {
    / *
    console.info('getCustomerName() - CID:', customerId);
    var customer = Customer.find(customerId);
    return customer.name;
    * /
    return Customer.find(customerId).name;
  };
*/

  $scope.getCustomers = function (viewValue) {
    console.info('getCustomers() - viewValue:', viewValue);
    return Customer.all;
  };

  $scope.onCustomerSelect = function(item, model, label) {
    console.info('onCustomerSelect() - item, model, label:', item, model, label);
    //if (!$scope.servicereport.location)
    console.info('item:', item);
    $scope.customer = item;
    $scope.servicereport.location = item.address;
  };

/*
  $scope.formatTimeDuration = function(value) {
    value = value.replace(/\./g, ':');
    //console.info('value:', value);
    var sepidx = value.indexOf(':');
    //console.info('sepidx:' , sepidx);
    if (sepidx >= 0) {
      //console.info('value.substr(sepidx + 1).length :', value.substr(sepidx + 1).length);
      if (value.substr(sepidx + 1).length <= 1) {
        value = value.substr(0, sepidx + 1) + '0' + value.substr(sepidx + 1);
      }
    } else {
      value += ':00';
    }
    //console.info('return value:', value);
    return value;
  };
*/

/*
  $scope.typeof = function (val) {
    return typeof val;
  };
*/
/*
  $scope.match = function (str, pattern) {
    var regex = new RegExp(pattern, 'g');
    return str.match(regex);
  };
*/
  $scope.print = function () {
    setTimeout(function () {
      window.print();
    }, 0);
  };

  $scope.initServicereport();

});