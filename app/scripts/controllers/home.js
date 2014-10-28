'use strict';

/**
 * @ngdoc function
 * @name smartUpApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the smartUpApp
 */
app.controller('HomeCtrl', function ($rootScope, $scope, $location) {
  $rootScope.formLabel = '';

  $scope.isActive = function(route) {
    return route === $location.path();
  };

});