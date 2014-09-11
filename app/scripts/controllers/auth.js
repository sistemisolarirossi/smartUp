'use strict';
 
app.controller('AuthCtrl', function ($scope, $rootScope, $routeParams, $location, Auth, md5, User) {
  $rootScope.formLabel = '';

  if (Auth.signedIn()) {
    $location.path('/');
  }

  $scope.params = $routeParams;
  $scope.error = null;
  $scope.info = null;

  $scope.login = function () {
    $scope.$broadcast('autofillFix:update');
  	console.info('$scope.login() - $scope.user:', $scope.user);
    if ($scope.user && $scope.user.usernameOrEmail && $scope.user.password) {
      Auth.login($scope.user).then(function (authUser) {
        $scope.user = angular.copy(authUser); // TODO: REMOVE THIS (copy useful fields...)
        console.info('$scope.login() - authUser:', authUser);
        if (!$scope.user.imageUrl) { // we use gravatars for 'password' logins and for providers without imageUrl
          /* jshint camelcase: false */
          $scope.user.imageUrl = 'http://www.gravatar.com/avatar/' + authUser.md5_hash;
        }
        if ($scope.user.usernameOrEmail && $scope.user.usernameOrEmail.indexOf('@') !== -1) { // user email looks like an email
          //console.log('user inserted value looks like an email');
          $scope.user.email = $scope.user.usernameOrEmail; // set user email with user inserted value
          $scope.user.username = $scope.user.usernameOrEmail.replace(/\@.*/, ''); // set user username with username part of user inserted value
        } else { // user value doesn't look like an email
          //console.log('user inserted value looks like an username');
          $scope.user.email = null; // set user email with empty value
          $scope.user.username = $scope.user.usernameOrEmail; // set user username with user inserted value
        }
        //delete $scope.user.usernameOrEmail;
        console.info('User.setCurrentUser($scope.user):', $scope.user);
        User.setCurrentUser($scope.user);
        console.info('User.setCurrentUser($scope.user) => currentUser:', $rootScope.currentUser);
        $location.path('/');
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
      $scope.user = angular.copy(authUser); // TODO: REMOVE THIS (copy useful fields...)
      // social provider, username not present
      $scope.user.username = authUser.displayName; // TODO: check if do we have displayName for all providers?
      if (provider === 'google') {
        $scope.user.email = authUser.email;
        $scope.user.imageUrl = authUser.thirdPartyUserData.picture;
      }
      if (provider === 'facebook') {
        $scope.user.email = authUser.thirdPartyUserData.email;
        $scope.user.imageUrl = authUser.thirdPartyUserData.picture.data.url;
      }
      if (provider === 'twitter') {
        $scope.user.email = null; // twitter does not return email
        /* jshint camelcase: false */
        $scope.user.imageUrl = authUser.thirdPartyUserData.entities.profile_image_url/*_https*/;
      }
      if (!$scope.user.imageUrl) { // we use gravatars for 'password' logins and for providers without imageUrl
        $scope.user.imageUrl = 'http://www.gravatar.com/avatar/';
        if ($scope.user.email) { // twitter does not returns user's email
          /* jshint camelcase: false */
          $scope.user.md5_hash = md5.createHash($scope.user.email);
          /* jshint camelcase: false */
          $scope.user.imageUrl += $scope.user.md5_hash;
        }
      }
      User.create($scope.user).then(
        function () {
          User.setCurrentUser($scope.user);
        },
        function (error) {
          toastr.error('Couldn\'t create user ' + $scope.user.username + ': ' + error.message);
          //console.error('Couldn\'t create user ' + $scope.user.username + ':', error.message);
        }
      );
      $location.path('/');
     }, function (error) {
      $scope.error = 'loginSocial('+provider+') failed (' + error.message + ')';
    });
  };

  $scope.logout = function () {
    User.resetCurrentUser();
    Auth.logout();
    $rootScope.formLabel = '';
    $location.path('/');
  };

  $scope.register = function (valid) {
    console.info('controller - register');
    $scope.formRegisterSubmitted = true; // allow validation errors to be shown
    if (!valid) {
      return;
    }
    console.info('controller - register - valid', $scope.user);
    if ($scope.user) {
      Auth.register($scope.user).then(function (auth) {
        auth.user.username = $scope.user.username;
        console.info('registered user:', auth.user);
        User.create(auth.user).then(function (error) {
          // TODO: check this (is always undefined???) ...
          if (error) {
            toastr.error('Error registering user:' + error);
            console.error('Error registering user:', error);
          }
        });
        $location.path('/');
      }, function (error) {
        $scope.error = 'Sorry, could not register user (' + error.message + ')';
        console.error('Register error:', error.message);
      });
    } else {
      $scope.error = 'Please specify user\'s data';
    }
  };

  $scope.sendPasswordResetEmail = function (email) {
    $scope.reset();
    Auth.sendPasswordResetEmail(email).then(function(error) {
      if (typeof error === 'undefined') {
        toastr.warning('A temporary password has just sent to your email address');
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