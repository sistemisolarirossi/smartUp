'use strict';
 
app.controller('AuthCtrl', function ($scope, $rootScope, $routeParams, $location, $window, CFG, Auth, User) {
  $rootScope.formLabel = '';

  if (Auth.signedIn()) {
    $location.path('/');
  }

  $scope.params = $routeParams;
  $scope.error = null;
  $scope.info = null;
  $scope.debug = CFG.DEBUG;
  $scope.lastBuildDate = lastBuildDate;

  // watch rootScope online status variable
  $scope.$watch(function() {
    return $rootScope.online;
  }, function() {
    $scope.online = $rootScope.online;
    console.log('changed online status to ' + $scope.online);
  }, true);

  // watch rootScope appcache status variable
  $scope.$watch(function() {
    return $rootScope.appcache;
  }, function() {
    $scope.appcache = $rootScope.appcache;
    console.log('changed appcache status to ' + $scope.appcache.status);
  }, true);
  
  $scope.appcacheUpdate = function () {
    console.info('appcacheUpdate()');
    var msg;
    switch ($rootScope.appcache.status) {
      case '':
        msg = 'Cache is being initialized';
        break;
      case 'error':
        msg = 'Cache is not updated (probably the manifest is unreachable)';
        break;
      case 'cached':
        msg = 'Cache is up-to-date';
        break;
      case 'checking':
        msg = 'Checking for the presence of an update';
        break;
      case 'downloading':
        msg = 'Preparing the downloading an update';
        break;
      case 'noupdate':
        msg = 'No update is present';
        break;
      case 'obsolete':
        msg = 'Cache is obsolete';
        break;
      case 'progress':
        msg = 'Downloading an update';
        break;
      case 'updateready':
        //msg = 'An update is ready';
        $window.applicationCache.swapCache();
        $window.location.reload();
        //$rootScope.appcache.status = ''; // TODO: FF needs this... why?
        break;
      default: // shouldn't happen
        msg = 'Cache is in unknown state "' + $rootScope.appcache.status + '"';
        break;
    }
    if (msg) {
      toastr.info(msg);
    }
  };

  $scope.register = function (valid) {
    console.info('controller - register');
    $scope.$broadcast('autofillFix:update');
    $scope.formRegisterSubmitted = true; // allow validation errors to be shown
    if (!valid) {
      return;
    }
    console.info('controller - register - valid', $scope.user);
    if ($scope.user) {
      Auth.register($scope.user).then(function (auth) {
        console.info('registered user:', auth.user);
        auth.user.username = $scope.user.username;
        User.create(auth.user).then(
          function () {
            /* success */
            $location.path('/');
          },
          function (error) {
            toastr.error('Couldn\'t create user ' + auth.user.username);
            console.error('Couldn\'t create user ', auth.user, ':', error);
          }
        );
      }, function (error) {
        $scope.error = 'Sorry, could not register user (' + error.message + ')';
        console.error('Register error:', error.message);
      });
    } else {
      $scope.error = 'Please specify user\'s data';
    }
  };

  $scope.login = function () {
    $scope.$broadcast('autofillFix:update');
    if ($scope.user && $scope.user.usernameOrEmail && $scope.user.password) {
      Auth.login($scope.user).then(function (authUser) {
        console.warn('Auth.login($scope.user).then() RETURNED - authUser:', authUser);
        if (authUser) {
          var user = User.findByUid(authUser.uid);
          User.setCurrentUser(user);
          $location.path('/');
        } else {
          $scope.error = 'Please specify an existing username/email';
        }
      }, function (error) {
        $scope.error = 'Login failed (' + error.message + ')';
      });
    } else {
      if (!$scope.user) {
        $scope.error = 'Please specify a username/email and password';
      } else {
        if (!$scope.user.usernameOrEmail) {
          $scope.error = 'Please specify a username/email';
        } else {
          if (!$scope.user.password) {
            $scope.error = 'Please specify a password';
          }
        }
      }
    }
  };

  $scope.loginSocial = function (provider) {
    Auth.loginSocial(provider).then(function (authUser) {
      //console.warn('Auth.loginSocial(provider).then() RETURNED - authUser:', authUser);
      //$scope.user = angular.copy(authUser); // TODO: REMOVE THIS (copy useful fields?)
      //User.create($scope.user).then(
      User.create(authUser).then(
        function () {
          /* success */
          var user = User.findByUid(authUser.uid);
          User.setCurrentUser(user);
        },
        function (error) {
          toastr.error('Couldn\'t create user ' + authUser.username);
          console.error('Couldn\'t create user ' + authUser + ':', error);
        }
      );
    }, function (error) {
      console.error = 'loginSocial('+provider+') failed (' + error.message + ')';
      toastr.error = 'loginSocial('+provider+') failed (' + error.message + ')';
    })/*.catch(error) {
      console.error = 'CATCHED loginSocial('+provider+') failed (' + error + ')';
      toastr.error = 'CATCHED loginSocial('+provider+') failed (' + error.message + ')';      
    }*/;
  };

  $scope.logout = function () {
    User.resetCurrentUser();
    Auth.logout();
    $rootScope.formLabel = '';
    $location.path('/');
  };

  $scope.sendPasswordResetEmail = function (email) {
    $scope.reset();
    Auth.sendPasswordResetEmail(email).then(function(error) {
      if (typeof error === 'undefined') {
        toastr.info('Password sent');
        $scope.info =
          'An email with a temporary password has been sent to your email: ' +
          'use it to login and then change it.';
      } else {
        if (error.code === 'INVALID_EMAIL') {
          $scope.error = 'Please specify a valid email';
        } else {
          if (error.code === 'INVALID_USER') {
            $scope.error = 'Sorry, this is not a registered email';
          } else {
            $scope.error = 'Sorry, could not send password email (' + error.message + '). Please retry later.';
          }
        }
      }
    });
  };

  $scope.reset = function() {
    $scope.error = null;
    $scope.info = null;
  };

  $scope.reset();

});