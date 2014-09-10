'use strict';
 
app.controller('AuthCtrl', function ($scope, $rootScope, $routeParams, $location, Auth, md5, User) {
  $rootScope.formLabel = '';

  if (Auth.signedIn()) {
  	//console.info('signedIn');
    $location.path('/');
  }

  $scope.params = $routeParams;

/*
  $scope.$on('$firebaseSimpleLogin:login', function () {
    //console.info('*** $firebaseSimpleLogin:login did fire, redirecting to /');
    $location.path('/');
  });
*/

  $scope.error = null;
  $scope.info = null;

  $scope.login = function () {
    $scope.$broadcast('autofillFix:update');
  	console.info('$scope.login() - $scope.user:', $scope.user);
    if ($scope.user && $scope.user.usernameOrEmail && $scope.user.password) {
      Auth.login($scope.user).then(function (authUser) {
        console.info('@@@@@@ Auth.login() returned authUser:', authUser);
        console.info('@@@@@@ Auth.login() $scope.user:', $scope.user);
        //$scope.user = angular.copy(authUser); // do we need this?
        if (!$scope.user.imageUrl) { // we use gravatars for 'password' logins and for providers without imageUrl
          /* jshint camelcase: false */
          $scope.user.imageUrl = 'http://www.gravatar.com/avatar/' + authUser.md5_hash;
        }
        if ($scope.user.usernameOrEmail && $scope.user.usernameOrEmail.indexOf('@') !== -1) { // user email looks like an email
          console.log(' [-] user inserted value looks like an email');
          $scope.user.email = $scope.user.usernameOrEmail; // set user email with user inserted value
console.info('[&&&&] USERNAME: ', $scope.user.username);
          $scope.user.username = $scope.user.usernameOrEmail.replace(/\@.*/, ''); // set user username with username part of user inserted value
        } else { // user value doesn't look like an email
          console.log(' [-] user inserted value looks like an username');
          $scope.user.email = null; // set user email with empty value
          $scope.user.username = $scope.user.usernameOrEmail; // set user username with user inserted value
        }
        delete $scope.user.usernameOrEmail;
console.info('&&&& USERNAME: ', $scope.user.username);
        User.setCurrentUser($scope.user.username);
        $location.path('/');
      }, function (error) {
        var cause = null;
        if (error.code === 'INVALID_PASSWORD') {
          cause = 'wrong password';
        } else {
          if (error.code === 'INVALID_EMAIL') {
            if ($scope.user.email) {
              cause = 'wrong email';
            } else {
              cause = 'username not found';
            }
          } else {
            cause = error.code.replace(/_/, ' ');
          }
        }
        $scope.error = 'Login failed (' + cause + ')';
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

/*
  $scope.loginWithGoogle = function () {
    Auth.loginWithGoogle().then(function (authUser) {
      $scope.user = angular.copy(authUser);
      $scope.user.username = authUser.displayName; // do we have displayName for all providers?
      / * jshint camelcase: false * /
      $scope.user.md5_hash = md5.createHash(authUser.email);
      //$scope.register(true);
      //$rootScope.currentUser = $scope.user;
      User.create($scope.user, $scope.user.username);
      console.info('loginWithGoogle() - User.create():', authUser);
      console.info('Auth.loginWithGoogle() returned authUser:', authUser);
      console.info('Auth.loginWithGoogle() $rootScope.currentUser:', $rootScope.currentUser);
      $location.path('/');
     }, function (error) {
      console.info('Auth.loginWithGoogle() returned error:', error);
      var cause = null;
      if (error.code === 'USER_DENIED') {
        cause = 'utente non autorizzato';
      } else {
        if (error.code === 'UNKNOWN_ERROR') {
          cause = 'errore sconosciuto durante la fase di autorizzazione'; // (possibly user did not authorize)
        } else {
          cause = error.code.replace(/_/, ' ');
        }
      }
      $scope.error = 'Login with Google failed (' + cause + ')';
    });
  };
*/

  $scope.loginSocial = function (provider) {
    Auth.loginSocial(provider).then(function (authUser) {
      console.info('!!!!!!!! Auth.loginSocial(' + provider + ') authUser:', authUser);
      $scope.user = angular.copy(authUser); // TODO: REMOVE THIS (copy useful fields...)
      // social provider, username not present
      $scope.user.username = authUser.displayName; // TODO: check if do we have displayName for all providers?
      /* NOjshint camelcase: false */
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
      if (!$scope.user.imageUrl) { // we nuse gravatars for 'password' logins and for providers without imageUrl
        //$scope.user.imageUrl = 'http://www.gravatar.com/avatar/' + $scope.user.md5_hash;
        if ($scope.user.email) { // twitter does not returns user's email
          /* jshint camelcase: false */
          $scope.user.md5_hash = md5.createHash($scope.user.email);
        }
        /* jshint camelcase: false */
        $scope.user.imageUrl = 'http://www.gravatar.com/avatar/' + $scope.user.md5_hash;
      }
      //$scope.register(true);
      //$rootScope.currentUser = $scope.user;
      console.info('++++++ Auth.loginSocial() - $scope.user:', $scope.user);
      User.create($scope.user, $scope.user.username).then(
        function () {
          console.info('Auth.loginSocial('+provider+') $scope.user:', $scope.user);
          /***********************************************/
          User.setCurrentUser($scope.user.username);
          /***********************************************/
        },
        function (error) {
          console.error('Couldn\'t create user ' + $scope.user.username + ':', error); // TODO: better handle errors...
        }
      );
      $location.path('/');
     }, function (error) {
      console.info('Auth.loginSocial('+provider+') returned error:', error);
      var cause = null;
      if (error.code === 'USER_DENIED') {
        cause = 'utente non autorizzato';
      } else {
        if (error.code === 'UNKNOWN_ERROR') {
          cause = 'errore sconosciuto durante la fase di autorizzazione'; // (possibly user did not authorize)
        } else {
          cause = error.code.replace(/_/, ' ');
        }
      }
      $scope.error = 'loginSocial('+provider+') failed (' + cause + ')';
    });
  };

/***********************************************/
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
        User.create(auth.user).then(function () {
          // TODO: check this (is always undefined???) ...
        });
        $location.path('/');
      }, function (error) {
        if (error.code === 'INVALID_EMAIL') {
          $scope.error = 'Please specify a valid email';
        } else {
          if (error.code === 'EMAIL_TAKEN') {
            $scope.error = 'Sorry, email is already registered';
          } else {
            if (error.code === 'AUTHENTICATION_DISABLED') {
              $scope.error = 'Sorry, authentication is currently disabled. Contact administrators.';
            } else {
              $scope.error = 'Sorry, could not register user (' + error.code.replace(/_/, ' ') + '). Please retry later.';
            }
          }
        }
        console.error('Register error:', $scope.error);
      });
    } else {
      $scope.error = 'Please specify user\'s data';
    }
  };

  $scope.sendPasswordResetEmail = function (email) {
    $scope.reset();
    /*
    if (!email) {
      $scope.info = 'Please insert your email, first';
    }
    */
    Auth.sendPasswordResetEmail(email).then(function(error) {
      if (typeof error === 'undefined') {
        //console.info('Password reset email sent successfully');
        toastr.warning('A temporary password has just sent to your email address');
        $scope.info =
          'An email with a temporary password has been sent to your email: ' +
          'use it to login and then change it.';
      } else {
        //console.info('Error sending password reset email:', error);
        if (error.code === 'INVALID_EMAIL') {
          $scope.error = 'Please specify a valid email';
        } else {
          if (error.code === 'INVALID_USER') {
            $scope.error = 'Sorry, this is not a registered email';
          } else {
            $scope.error = 'Sorry, could not send password email (' + error.code + '). Please retry later.';
          }
        }
      }
    });
  };


  $scope.reset = function() {
    $scope.error = null;
    $scope.info = null;
    //console.info('reset error:', $scope.error);
  };


  $scope.reset();

/*
  console.info('AuthCtrl - params:', $scope.params);
  if ($scope.params.authType === 'google+') {
    $scope.loginWithGoogle();
  }
*/
});