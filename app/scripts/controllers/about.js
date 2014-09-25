'use strict';

/**
 * @ngdoc function
 * @name smartUpApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the smartUpApp
 */
app.controller('AboutCtrl', function ($rootScope) {
  $rootScope.formLabel = 'About';
  //$rootScope.today = new Date(); // TODO: WHY???
  //$rootScope.today1 = new Date(); //$rootScope.today1;
  $rootScope.today1 = new Date();
});
