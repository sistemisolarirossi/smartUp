'use strict';
 
app.controller('UsersCtrl', function ($scope, $rootScope, $routeParams, $location, User) {

  $rootScope.formLabel = 'Users';

  if ($routeParams.username) {
    $scope.user = User.findByUsername($routeParams.username);
  } else {
    $scope.user = {};
  }
  $scope.users = User.all;
  /*
  if ($location.path() === '/users') { // to handle routes like "/customers:$id"
    $scope.users = User.all;
  }
  */

});