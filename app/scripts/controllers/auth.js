'use strict';
 
app.controller('AuthCtrl', function ($scope, $routeParams, $location, Auth, User) {
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
  	console.info('$scope.login() - $scope.user:', $scope.user);
    if ($scope.user && $scope.user.usernameOrEmail && $scope.user.password) {
      Auth.login($scope.user).then(function (authUser) {
        console.info('Auth.login() returned authUser:', authUser);
        $location.path('/');
      }, function (error) {
        var cause = null;
        if (error.code === 'INVALID_PASSWORD') {
          cause = 'wrong password';
        } else {
          if (error.code === 'INVALID_EMAIL') {
            cause = 'wrong email';
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

  $scope.loginWithGoogle = function () {
    Auth.loginWithGoogle().then(function (authUser) {
      console.info('Auth.loginWithGoogle() returned authUser:', authUser);
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

  $scope.register = function (valid) {
    $scope.formRegisterSubmitted = true; // allow validation errors to be shown
    if (!valid) {
      return;
    }
    if ($scope.user) {
      Auth.register($scope.user).then(function (authUser) {
        User.create(authUser, $scope.user.username);
        console.info('registered user:', authUser);
        //$scope.formRegister = false;
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