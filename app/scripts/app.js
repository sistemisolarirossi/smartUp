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
  'ngMessages',
  'firebase',
  'ui.bootstrap',
  'angular-md5',
  //'gettext',
  'tmh.dynamicLocale'
]); 

app.constant('CFG', {
  FIREBASE_URL:         'https://smartup.firebaseio.com/',
/* TODO: REMOVE THESE... */
/*
  ROLES: {
    ADMIN:              1,
    EDIT_CUSTOMERS:     2
  },
*/
/* ********************* */
  SYSTEM_EMAIL:         'sistemisolarirossi@gmail.com',
  APPCACHE:             false,
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

/**
 * Datepicker config
 */
app.config(function (datepickerConfig, datepickerPopupConfig) {
  datepickerPopupConfig.showButtonBar = false;
});

/**
 * TmhDynamicLocaleProvider config
 */
app.config(function (tmhDynamicLocaleProvider) {
  tmhDynamicLocaleProvider.localeLocationPattern('scripts/i18n/angular-locale_{{locale}}.js');
});

/*
app.config(function (ngQuickDateDefaultsProvider) {
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
    console.info('************* GONE OFFLINE *************');
    $rootScope.$apply(function () {
      $rootScope.online = false;
    });
  }, false);
  $window.addEventListener('online', function () {
    console.info('************* GONE ONLINE *************');
    $rootScope.$apply(function () {
      $rootScope.online = true;
    });
  }, false);
});

/**
 * Watch for app-cache status 
 */
app.run(function ($window, $rootScope, CFG) {
  if (CFG.APPCACHE) {
    $rootScope.appcache = {};
    $rootScope.appcache.status = 'initializing';
  
    $window.applicationCache.addEventListener('error', function (error) {
      //if ($rootScope.online) {
        //console.info('Error fetching manifest: a good chance we are offline', error);
        //console.info('************* PROBABLY GONE OFFLINE *************');
        $rootScope.$apply(function () {
          //$rootScope.online = false;
          $rootScope.appcache.status = 'error';
          console.info('% appcache status: ' + $rootScope.appcache.status + ' %', error);
        });
      //} else {
      //  // we are already offline, ignore errors...
      //}
    }, false);
  
    $window.applicationCache.addEventListener('cached', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'cached';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('checking', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'checking';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('downloading', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'downloading';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('noupdate', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'cached';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('obsolete', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'cached';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('progress', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'progress';
        console.info('% appcache status: ' + $rootScope.appcache.status + ' %');
      });
    }, false);
  
    $window.applicationCache.addEventListener('updateready', function () {
      $rootScope.$apply(function () {
        $rootScope.appcache.status = 'updateready';
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

/**
 * Initialize i18n
 */
app.run(function ($rootScope, $window, $route, gettextCatalog, tmhDynamicLocale) {

  /* supported Languages */
  $rootScope.supportedLanguages = {
    en: {
      name: 'English',
      flag: 'app/icons/flag-en.png',
      angularLocaleScript: 'scripts/18n/angular-locale_en.js',
    },
    de: {
      name: 'German',
      flag: 'app/icons/flag-de.png',
      angularLocaleScript: 'scripts/18n/angular-locale_de.js',
    },
    es: {
      name: 'Spanish',
      flag: 'app/icons/flag-es.png',
      angularLocaleScript: 'scripts/18n/angular-locale_es.js',
    },
    fr: {
      name: 'French',
      flag: 'app/icons/flag-fr.png',
      angularLocaleScript: 'scripts/i18n/angular-locale_fr.js',
    },
    it: {
      name: 'Italian',
      flag: 'app/icons/flag-it.png',
      angularLocaleScript: 'scripts/i18n/angular-locale_it.js',
    }, 
    ':default:': 'en'
  };

  $rootScope.nextLanguage = function (currentLanguage) {
    var language = (
      currentLanguage === 'en' ? 'de' :
      currentLanguage === 'de' ? 'es' :
      currentLanguage === 'es' ? 'fr' :
      currentLanguage === 'fr' ? 'it' :
                                 'en'
    );
    $rootScope.currentLanguage = language;
    gettextCatalog.currentLanguage = $rootScope.currentLanguage;
    tmhDynamicLocale.set($rootScope.currentLanguage);
    $route.reload();
  };

  $rootScope.browserLanguage = $window.navigator.userLanguage || $window.navigator.language;
  console.info('browser language is', $rootScope.browserLanguage);
  
  // set current language
  $rootScope.currentLanguage = $rootScope.supportedLanguages[':default:'];
  if ($rootScope.browserLanguage) {
    if ($rootScope.supportedLanguages[$rootScope.browserLanguage]) {
      $rootScope.currentLanguage = $rootScope.browserLanguage;
    } else {
      var language = $rootScope.browserLanguage.replace(/-.*$/, '');
      if ($rootScope.supportedLanguages[language]) {
        $rootScope.currentLanguage = language;
      }
    }
  }
  console.info('current language is', $rootScope.currentLanguage);
  gettextCatalog.currentLanguage = $rootScope.currentLanguage;
  if ($rootScope.currentLanguage !== $rootScope.supportedLanguages[':default:']) { // no need to load locale for default language ('en'), I suppose... (TODO: check it...)
    tmhDynamicLocale.set($rootScope.currentLanguage);
  }

/*

  Multilingual date formats:

  'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
  'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
  'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
  'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010)
  'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
  'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
  'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
  'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
*/

  gettextCatalog.debug = true; // TODO: use a constants provider (see http://bahmutov.calepin.co/inject-valid-constants-into-angular.html, Step 4), to use global CFG.DEBUG constant
});