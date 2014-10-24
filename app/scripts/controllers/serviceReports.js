'use strict';
 
app.controller('ServicereportsCtrl', function ($scope, $rootScope, $location, $filter, CFG, Servicereport, Customer, Auth, DateTime) {
  $rootScope.formLabel = 'Service reports';

  $scope.servicereport = {};
  $scope.servicereports = Servicereport.all;

  $scope.CFG = CFG; // to access CFG from view

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

  $scope.$watch('formAddEdit.$valid', function() {
    $scope.formAddEditValid = true;
  });

  $scope.servicereports.$on('loaded', function() {
    $scope.servicereport.number = Servicereport.getNumberNext();
  });

/*
  $('.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  });
*/

  $scope.initServicereport = function () {
    //$scope.servicereport.number = null;
    $scope.servicereport.operator = $scope.currentUser ? $scope.currentUser.username : null;
    //$scope.servicereport.dateIn = new Date(); // put this in dateInit() ?
    //$scope.servicereport.dateOut = $scope.servicereport.dateIn; // put this in dateInit() ?
    $scope.servicereport.duration = null;
    $scope.servicereport.location = null;
    $scope.servicereport.notes = null;
    $scope.servicereport.dateCreation = null;
    $scope.customer = null;
    $scope.formAddEditValid = false;
    $scope.formAddEditSubmitted = false;
    $scope.currentId = null;
    $scope.addMode = false;
    $scope.editMode = false;  
    $scope.printMode = false;
    $scope.orderby = '-number';
    $scope.dateInit();
  };

  $scope.submitServicereport = function () {
    $scope.formAddEditSubmitted = true; // allow validation errors to be shown
    if (!$scope.formAddEditValid) {
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
    //var id = servicereport.$id;
    //Servicereport.delete(id);
    Servicereport.delete(servicereport);
  };

  $scope.addServicereport = function () {
    $scope.initServicereport();
    $scope.addMode = true;
    $scope.servicereport.number = Servicereport.setNumberNext();
  };

  $scope.currentUserCanRead = function () {
    //console.info('currentUserCanRead - $rootScope.currentUser:', $rootScope.currentUser);
    if ($rootScope.currentUser) {
      //console.info('currentUserCanRead - currentUser is set');
      //console.info('currentUserCanRead - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.servicereports) {
        //console.info('currentUserCanRead - currentUser.roles.read.servicereports:', $rootScope.currentUser.roles.servicereports.read);
        //console.info('currentUserCanRead - retval:', $rootScope.currentUser.roles.servicereports.read);
        return $rootScope.currentUser.roles.servicereports.read;
      } else {
        //console.info('currentUserCanRead - returning FALSE - no servicereports roles on user', $rootScope.currentUser);
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
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.servicereports) {
        //console.info('currentUserCanWrite - currentUser.roles.write.servicereports:', $rootScope.currentUser.roles.servicereports.write);
        //console.info('currentUserCanWrite - retval:', $rootScope.currentUser.roles.servicereports.write);
        return $rootScope.currentUser.roles.servicereports.write;
      } else {
        //console.info('currentUserCanWrite - returning FALSE (no servicereports roles on user)', $rootScope.currentUser);
        return false;
      }
    }
    //console.info('currentUserCanWrite - returning FALSE');
    return false;
  };

  $scope.editServicereport = function (servicereport) {
    if (!$scope.editMode) {
      var id = servicereport.$id;
      $scope.currentId = id;
      $scope.servicereport = Servicereport.find(id);
      $scope.customer = Customer.find($scope.servicereport.customerId);
      //console.info('EDIT $scope.servicereport:', id, $scope.servicereport);
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
      //console.info('Preprint $scope.servicereport:', id, $scope.servicereport);
      $scope.printMode = true;
    } else {
      $scope.printMode = false;
    }
  };

  $scope.printServicereport = function () {
    if ($scope.printMode) {
      $scope.print();
      window.onafterprint = function () {
        //console.log('Printing dialog closed...');
        $scope.printMode = false;
        $scope.$apply();
      };
    }
  };

  $scope.dateInit = function () {
    $scope.dateMin = null;
    $scope.dateMax = null;
    $scope.dateFormat = 'longDate'; // dd MMMM yyyy
    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false
    };
    $scope.hourStep = 1;
    $scope.minuteStep = 1;
    $scope.showMeridian = false;

    //$scope.servicereport.dateIn = $filter('date')(new Date(), $scope.dateFormat);
    $scope.servicereport.dateIn = new Date(); // put this here?
    $scope.servicereport.dateOut = $scope.servicereport.dateIn; // put this here?
    $scope.timeIn = $scope.servicereport.dateIn; // why timeIn and not servicereport.timeIn?
    $scope.servicereport.dateIn.setHours($scope.timeIn.getHours());
    $scope.servicereport.dateIn.setMinutes($scope.timeIn.getMinutes());
    $scope.servicereport.dateIn.setSeconds(0);

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