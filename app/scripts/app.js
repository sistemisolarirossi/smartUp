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
    'dependencies": {
      ...
      'angular-resource": "1.2.16",
      'angular-cookies": "1.2.16",
      'angular-animate": "1.2.16",
      'angular-touch": "1.2.16",
      ...
    },
  */
  'ngSanitize',
  'ngRoute',
  'ngAutocomplete',
  'firebase',
  'ui.bootstrap',
  'angular-md5'
]); 

app.constant('CFG', {
  FIREBASE_URL:         'https://smartup.firebaseio.com/',
/* TODO: REMOVE THESE... */
  ROLES: {
    ADMIN:              1,
    EDIT_CUSTOMERS:     2
  },
/* ********************* */
  SYSTEM_EMAIL:         'sistemisolarirossi@gmail.com',
  DEBUG:                true
});

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
    .when('/login/:authType', {
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

/**
 * Override template cache
 */
app.run(['$templateCache', function($templateCache) {

  /* hide timepicker up/down arrows */
  $templateCache.put('template/timepicker/timepicker.html',
    '<table>' +
    ' <tbody>' +
    '   <tr>' +
    '     <td style="width: 3.0em;" class="form-group" ng-class="{\'has-error\': invalidHours}">' +
    '       <input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">' +
    '     </td>' +
    '     <td></td>' +
    '     <td style="width: 3.0em;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">' +
    '       <input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">' +
    '     </td>' +
    '     <td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>' +
    '   </tr>' +
    ' </tbody>' +
    '</table>'
  );
}]);

/**
 * Watch for on/off-line status
 */
app.run(function($window, $rootScope) {
  $rootScope.online = navigator.onLine;
  $rootScope.appcache = {};
  $window.addEventListener('offline', function () {
    console.info('************* GONE OFFLINE *************');
    $rootScope.$apply(function() {
      $rootScope.online = false;
    });
  }, false);
  $window.addEventListener('online', function () {
    console.info('************* GONE ONLINE *************');
    $rootScope.$apply(function() {
      $rootScope.online = true;
    });
  }, false);

  $window.applicationCache.addEventListener('error', function (error) {
    //if ($rootScope.online) {
      //console.info('Error fetching manifest: a good chance we are offline', error);
      //console.info('************* PROBABLY GONE OFFLINE *************');
      $rootScope.$apply(function() {
        //$rootScope.online = false;
        $rootScope.appcache.status = 'error';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %', error);
      });
    //} else {
    //  // we are already offline, ignore errors...
    //}
  }, false);

  $window.applicationCache.addEventListener('cached', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'cached';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
    });
  }, false);

  $window.applicationCache.addEventListener('checking', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'checking';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
    });
  }, false);

  $window.applicationCache.addEventListener('downloading', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'downloading';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
    });
  }, false);

  $window.applicationCache.addEventListener('noupdate', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'cached';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
    });
  }, false);

  $window.applicationCache.addEventListener('obsolete', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'cached';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
    });
  }, false);

  $window.applicationCache.addEventListener('progress', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'progress';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
    });
  }, false);

  $window.applicationCache.addEventListener('updateready', function () {
    $rootScope.$apply(function() {
      $rootScope.appcache.status = 'updateready';
      console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      // TODO: use something async to immediately update appcache.status color on view
/*
      if ($window.confirm('An update is ready. Press OK to use it now.')) {
        $window.applicationCache.swapCache();
        location.reload();
      }
*/
    });
  }, false);

/*
cache.addEventListener('cached', logEvent, false);
cache.addEventListener('checking', logEvent, false);
cache.addEventListener('downloading', logEvent, false);
cache.addEventListener('noupdate', logEvent, false);
cache.addEventListener('obsolete', logEvent, false);
cache.addEventListener('progress', logEvent, false);
cache.addEventListener('updateready', logEvent, false);
cache.addEventListener('error', logEvent, false);
*/
});