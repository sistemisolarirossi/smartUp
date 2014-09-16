'use strict';

/**
 * @ngdoc function
 * @name smartUpApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the smartUpApp
 */
app.controller('HomeCtrl', function ($rootScope, $scope) {
  $rootScope.formLabel = '';

  $scope.$watch($rootScope.online, function () {
    $scope.online = $rootScope.online;
    console.log('*** [home] ***************** changed online status: ' + $scope.online + ' ******************');
  });
});