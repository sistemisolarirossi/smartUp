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
  /* currently we don't need these modules:
    'ngAnimate', // bower.json: "angular-resource": "1.2.16",
    'ngCookies', // bower.json: "angular-cookies": "1.2.16",
    'ngResource', // bower.json: "angular-animate": "1.2.16",
    'ngTouch', // bower.json: "angular-touch": "1.2.16",
  */
  'ngSanitize',
  'ngRoute',
  'ngAutocomplete',
  'ngMessages',
  'firebase',
  'ui.bootstrap',
  'angular-md5',
  'gettext',
  'tmh.dynamicLocale'
]); 

app.constant('CFG', {
  APP_NAME:        'smartUp',
  APP_FULLNAME:    'Sistemi Solari Rossi',
  APP_LOGO:        'icons/logo.png',
  FIREBASE_URL:    'https://smartup.firebaseio.com/',
  SYSTEM_EMAIL:    'sistemisolarirossi@gmail.com',
  APPCACHE:        true,
  DEBUG:           true
});

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'AuthCtrl'
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
      controller: 'ServicereportsCtrl'
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

/**
 * Datepicker config
 */
app.config(function (datepickerConfig, datepickerPopupConfig) {
  datepickerPopupConfig.showButtonBar = false;
});

/**
 * Setup i18n (for dynamic reloading)
 */
app.config(function (tmhDynamicLocaleProvider) {
  var localeLocationPattern = 'scripts/i18n/angular-locale_{{locale}}.js';
  tmhDynamicLocaleProvider.localeLocationPattern(localeLocationPattern);
});



/**
 * Initialize app: rottscope, i18n, ...
 */
app.run(function ($rootScope, CFG, I18N) {
  $rootScope.appName = CFG.APP_NAME;
  $rootScope.appLogo = CFG.APP_LOGO;
  $rootScope.today = new Date();
  I18N.setCurrentLanguage();
});

/**
 * Override template cache
 */
app.run(['$templateCache', function ($templateCache) {
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
app.run(function ($window, $rootScope) {
  $rootScope.online = navigator.onLine;
  $window.addEventListener('offline', function () {
    console.info('* GONE OFFLINE *');
    $rootScope.$apply(function () {
      $rootScope.online = false;
    });
  }, false);
  $window.addEventListener('online', function () {
    console.info('* GONE ONLINE *');
    $rootScope.$apply(function () {
      $rootScope.online = true;
    });
  }, false);
});

/**
 * Watch for app-cache status 
 */
app.run(function ($window, $rootScope, gettext, CFG) {
  if (CFG.APPCACHE) {
    $rootScope.appcache = {};
    $rootScope.appcache.status = gettext('initializing');
  
    $window.applicationCache.addEventListener('error', function (error) {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('error');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %', error);
      });
    }, false);
  
    $window.applicationCache.addEventListener('cached', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('cached');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('checking', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('checking');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('downloading', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('downloading');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('noupdate', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('cached');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('obsolete', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('obsolete');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('progress', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('progress');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('updateready', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = gettext('updateready');
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  }
});

/**
 * Stub for onbeforeprint / onafterprint compatibility
 */
app.run(function ($window) {
  var beforePrint = function () {
    console.log('Functionality to run before printing');
  };
  var afterPrint = function () {
    console.log('Functionality to run after printing');
  };
  if ($window.matchMedia) {
    var mediaQueryList = $window.matchMedia('print');
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
        beforePrint();
      } else {
        afterPrint();
      }
    });
  }
  $window.onbeforeprint = beforePrint;
  $window.onafterprint = afterPrint;
});