'use strict';
 
app.controller('NavCtrl', function ($scope, $rootScope, $location, Auth) {

  $rootScope.formLabel = '';

  $scope.logout = function () {
    //console.info('logout...');
    $rootScope.formLabel = '';
    Auth.logout();
  };

});