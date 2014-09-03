/* global app:true */
'use strict';

/**
 * @ngdoc overview
 * @name smartUpApp
 * @description
 * # smartUpApp
 *
 * Main module of the application.
 */
var app = angular.module('smartUpApp', [
  /*
    // currently we don't need these modules
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngTouch',
    
    // in bower.json:
    "dependencies": {
      ...
      "angular-resource": "1.2.16",
      "angular-cookies": "1.2.16",
      "angular-animate": "1.2.16",
      "angular-touch": "1.2.16",
      ...
    },
  */
  'ngSanitize',
  'ngRoute',
  'ngAutocomplete',
  'firebase',
  'ui.bootstrap'
]); 
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'AuthCtrl' // WITHOUT THIS lINE A HARD PAGE REFRESH LOOSES AUTH USER! ...
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl'
    })
    .when('/customers', {
      templateUrl: 'views/customers.html',
      controller: 'CustomersCtrl'
    })
    .when('/orders', {
      templateUrl: 'views/orders.html',
      controller: 'OrdersCtrl'
    })
    .when('/orders/:orderId', {
      templateUrl: 'views/showorder.html',
      controller: 'OrderViewCtrl'
    })
    .when('/servicereports', {
      templateUrl: 'views/serviceReports.html',
      //controller: 'ServicereportCtrl'
    })
    .when('/contacts', {
      templateUrl: 'views/contacts.html',
      controller: 'ContactsCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UsersCtrl'
    })
    .when('/users/:username', {
      templateUrl: 'views/users.html',
    //templateUrl: 'views/profile.html',
      controller: 'UsersCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

});
app.config(function (datepickerConfig, datepickerPopupConfig) {
  datepickerPopupConfig.showButtonBar = false;
});
/*
app.config(function(ngQuickDateDefaultsProvider) {
  return ngQuickDateDefaultsProvider.set({
    closeButtonHtml: '<i class="glyphicon glyphicon-remove-circle"></i>',
    buttonIconHtml: '<i class="glyphicon glyphicon-time"></i>&nbsp;',
    nextLinkHtml: '<i class="glyphicon glyphicon-chevron-right"></i>',
    prevLinkHtml: '<i class="glyphicon glyphicon-chevron-left"></i>'
  });
});
*/

// TODO: ALWAYS USE CFG, REMOVE THIS...
//app.constant('FIREBASE_URL', 'https://smartup.firebaseio.com/');

app.constant('CFG', {
  FIREBASE_URL: 'https://smartup.firebaseio.com/',
/*
  ROLES: {
    ADMIN:              1,
    EDIT_CUSTOMERS:     2
  }
*/
});

/*
  .config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
      // todo start the spinner here
      $('#loading').show();
      return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
  })
  // register the interceptor as a service, intercepts ALL angular ajax http calls
  .factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
      return promise.then(function (response) {
        // hide the spinner on success
        $('#loading').hide();
        return response;
      }, function (response) {
        // hide the spinner on error
        $('#loading').hide();
        return $q.reject(response);
      });
    };
  })
*/

/*
app.run(function (stateFactory) {
  stateFactory.match = {};
  stateFactory.match.date = new Date();
  stateFactory.match.status = 'starting';
  stateFactory.teams = {};
});
*/

app.run(function () {
/*
  $('.nav a').on('click', function() {
    //$(".btn-navbar").click();
    $(".navbar-toggle").click();
  });
*/
});