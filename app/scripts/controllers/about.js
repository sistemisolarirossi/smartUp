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
  $rootScope.today = new Date(); // TODO: WHY???
});
