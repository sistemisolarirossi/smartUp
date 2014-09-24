'use strict';

/**
 * @ngdoc function
 * @name smartUpApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the smartUpApp
 */
app.controller('AboutCtrl', function ($rootScope) {
$rootScope.today = new Date();
  $rootScope.formLabel = 'About';
//$rootScope.formLabel = gettext('hello');
});
