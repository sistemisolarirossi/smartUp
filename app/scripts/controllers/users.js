'use strict';
 
app.controller('UsersCtrl', function ($scope, $rootScope, $routeParams, $location, CFG, User, Auth, gettext) {

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
  $scope.CFG = CFG; // to access CFG from view
  /*
  if ($location.path() === '/users') { // to handle routes like "/users:$id"
    $scope.users = User.all;
  }
  */
  $scope.$watch('formAddEdit.$valid', function(value) {
    console.info('form edit validity is', value);
    $scope.formAddEditValid = value;
  });

  $scope.initUser = function () {
    $scope.user.username = null;
    $scope.user.dateCreation = null;
  
    $scope.formAddEditValid = false;
    $scope.formAddEditSubmitted = false;
    //$scope.currentUid = null;
    $scope.editMode = false;  
    $scope.printMode = false;
    $scope.orderby = 'name';
  };

  $scope.editUser = function (user) {
    console.log('EDITUSER', user);
    if (!$scope.editMode) {
      //var uid = user.uid;
      //$scope.currentUid = uid;
      //$scope.user = User.findByUid(uid);
      $scope.user = User.find(user.uid);
      $scope.editMode = true;
      console.info('editing user:', $scope.user);
    } else {
      $scope.editMode = false;
    }
  };

  $scope.submitUser = function () {
    console.info('sumbit User, form is valid?', $scope.formAddEditValid);
    /* TODO: use custom validations server side (Firebase) */
    $scope.formAddEditSubmitted = true; // allow validation errors to be shown
    if (!$scope.formAddEditValid) {
      return;
    }

    if ($scope.editMode) {
      $scope.user.lastModify = new Date(); // set User modify date
      console.info('sumbit User in edit mode:', $scope.user);
      User.set($scope.user.uid, $scope.user).then(function () {});
    }
    $scope.editMode = false;
    $scope.formAddEditSubmitted = false; // forbid validation errors to be shown until next submission
  };

  $scope.cancelUser = function () {
    $scope.initUser();
    console.log('CANCEL - user now is empty:', $scope.user);
  };

  $scope.deleteUser = function (user) {
    console.info('deleteUser:', user);
    User.delete(user).then(
      function(error) {
        if (!error) {
          Auth.delete(user);
          console.info('deleteUser - success');
          toastr.info('User deleted');
        } else {
          console.info('deleteUser - error', error.replace(/_/, ' '));
          toastr.error('User not deleted: ' + error.replace(/_/, ' '));
        }
      }
    );
  };

  $scope.addUser = function () {
    $location.path('/register');
  };

  $scope.currentUserCanRead = function () {
    if ($rootScope.currentUser) {
      //console.info('currentUserCanRead - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.users) {
        //console.info('currentUserCanRead - currentUser.roles.read.users:', $rootScope.currentUser.roles.users.read);
        return $rootScope.currentUser.roles.users.read;
      } else {
        //console.info('currentUserCanRead - returning FALSE (no user roles on user)');
        return false;
      }
    }
    //console.info('currentUserCanRead - returning FALSE');
    return false;
  };

  $scope.currentUserCanWrite = function () {
    //console.info('currentUserCanWrite');
    if ($rootScope.currentUser) {
      //console.info('currentUserCanWrite - currentUser:', $rootScope.currentUser);
      if ($rootScope.currentUser.roles && $rootScope.currentUser.roles.users) {
        //console.info('currentUserCanWrite - currentUser.roles.write.users:', $rootScope.currentUser.roles.users.write);
        return $rootScope.currentUser.roles.users.write;
      } else {
        //console.info('currentUserCanWrite - returning FALSE (no users roles on user)');
        return false;
      }
    }
    //console.info('currentUserCanWrite - returning FALSE');
    return false;
  };

  $scope.flipRole = function (user, roledesc) {
    if (!user.roles || !user.roles[roledesc]) {
      // shouldn't happen...
      console.error('user:', user, 'no such roledesc:', roledesc);
      return false;
    }

    /*
       RW   => R
       R    => W
       W    => none
       none => RW
    */
    var userrole = user.roles[roledesc];
    if (userrole.read && userrole.write) {
      user.roles[roledesc].read = true;
      user.roles[roledesc].write = false;
    } else {
      if (userrole.read && !userrole.write) {
        user.roles[roledesc].read = false;
        user.roles[roledesc].write = true;
      } else {
        if (!userrole.read && userrole.write) {
          user.roles[roledesc].read = false;
          user.roles[roledesc].write = false;
        } else {
          user.roles[roledesc].read = true;
          user.roles[roledesc].write = true;
        }
      }
    }
    return true;
  };

  $scope.userRoleDescription = function (user, roledesc) {
    if (!user.roles || !user.roles[roledesc]) {
      return gettext('This user can\'t access');
    } else {
      var userrole = user.roles[roledesc];
      if (userrole.read && userrole.write) {
        return gettext('This user can read and write');
      } else {
        if (userrole.read && !userrole.write) {
          return gettext('This user can read');
        } else {
          if (!userrole.read && userrole.write) {
            return gettext('This user can write');
          } else {
            return gettext('This user can nor read nor write');
          }
        }
      }
    }
  };

});