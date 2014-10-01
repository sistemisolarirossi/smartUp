'use strict';
 
app.controller('UsersCtrl', function ($scope, $rootScope, $routeParams, $location, User, gettext) {

  $rootScope.formLabel = 'Users';

  /*
  $scope.roles = {
   'u': 'users',
   'c': 'customers',
   'o': 'orders',
   's': 'service reports'
  };
  */
  $scope.roles = [
    { key: 'u', desc: gettext('users') },
    { key: 'c', desc: gettext('customers') },
    { key: 'o', desc: gettext('orders') },
    { key: 's', desc: gettext('servicereports') }
  ];

  if ($routeParams.username) {
    $scope.user = User.findByUsername($routeParams.username);
  } else {
    $scope.user = {};
  }
  $scope.users = User.all;
  console.info('users: ', $scope.users);
  /*
  if ($location.path() === '/users') { // to handle routes like "/users:$id"
    $scope.users = User.all;
  }
  */

  $scope.currentUserCanRead = function () {
    if ($rootScope.currentUser) {
      console.info('currentUserCanRead - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.users) {
        console.info('currentUserCanRead - currentUser.roles.read.users:', $rootScope.currentUser.roles.users.read);
        return $rootScope.currentUser.roles.users.read;
      } else {
        console.info('currentUserCanRead - returning FALSE (no user roles on user)');
        return false;
      }
    }
    console.info('currentUserCanRead - returning FALSE');
    return false;
  };

  $scope.currentUserCanWrite = function () {
    console.info('currentUserCanWrite');
    if ($rootScope.currentUser) {
      console.info('currentUserCanWrite - currentUser is set');
      console.info('currentUserCanWrite - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.users) {
        console.info('currentUserCanWrite - currentUser.roles.write.users:', $rootScope.currentUser.roles.users.write);
        console.info('currentUserCanWrite - retval:', $rootScope.currentUser.roles.users.write);
        return $rootScope.currentUser.roles.users.write;
      } else {
        console.info('currentUserCanWrite - returning FALSE (no users roles on user)');
        return false;
      }
    }
    console.info('currentUserCanWrite - returning FALSE');
    return false;
  };

  $scope.userRoleDescription = function (user, role) {
    if (!user.roles || !user.roles[role.desc]) {
      return gettext('This user can\'t access');
    } else {
      var userrole = user.roles[role.desc];
      return gettext('This user can') + ' ' + (
        userrole.read && userrole.write ?  gettext('read and write') :
        userrole.read && !userrole.write ? gettext('read') :
        !userrole.read && userrole.write ? gettext('write') :
                                   gettext('not read nor write')
      );
    }
  };

});