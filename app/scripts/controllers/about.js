'use strict';

/**
 * @ngdoc function
 * @name smartUpApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the smartUpApp
 */
app.controller('AboutCtrl', function ($rootScope, gettextCatalog) {
  $rootScope.formLabel = gettextCatalog.getString('About');
  $rootScope.today = new Date();
});
