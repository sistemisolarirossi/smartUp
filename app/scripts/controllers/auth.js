'use strict';
 
app.controller('AuthCtrl', function ($scope, $location, Auth, User) {
  if (Auth.signedIn()) {
  	//console.info('signedIn');
    $location.path('/');
  }

  $scope.$on('$firebaseSimpleLogin:login', function () {
    //console.info('*** $firebaseSimpleLogin:login did fire, redirecting to /');
    $location.path('/');
  });

  $scope.error = null;
  $scope.info = null;

  $scope.login = function () {
  	//console.info('$scope.login() - $scope.user:', $scope.user);
    if ($scope.user) {
      Auth.login($scope.user).then(function () {
        //console.info('Auth.login() returned - $scope.user:', $scope.user);
        $location.path('/');
      }, function (error) {
        console.info($scope.error);
        if (error.code === 'INVALID_PASSWORD') {
          $scope.error = 'Wrong password'; // $scope.error.toString();
        } else {
          $scope.error = 'Login failed. Please retry'; // $scope.error.toString();
        }
      });
    } else {
      $scope.error = 'Please specify a user name and a password';
    }
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
          $scope.error = 'Please, specify a valid email';
        } else {
          if (error.code === 'EMAIL_TAKEN') {
            $scope.error = 'Sorry, email is already registered';
          } else {
            if (error.code === 'AUTHENTICATION_DISABLED') {
              $scope.error = 'Sorry, authentication is currently disabled. Contact administrators.';
            } else {
              $scope.error = error.code + 'Sorry, could not register user. Retry later.';
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
    if (!email) {
      $scope.info = 'Please, insert your email, first';
    }
    Auth.sendPasswordResetEmail(email).then(function(error) {
      if (typeof error === 'undefined') {
        //console.info('Password reset email sent successfully');
        $scope.info =
          'An email with a temporary password has been sent to your email.' +
          'Use it to login and then change it.';
      } else {
        //console.info('Error sending password reset email:', error);
        if (error.code === 'INVALID_EMAIL') {
          $scope.error = 'Please, specify a valid email';
        } else {
          $scope.error = 'Sorry, could not send password email. Retry later';
        }
      }
    });
  };

  $scope.reset = function() {
    $scope.error = null;
    $scope.info = null;
    console.info('reset error:', $scope.error);
  };

  $scope.reset();
});