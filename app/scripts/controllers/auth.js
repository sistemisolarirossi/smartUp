'use strict';
 
app.controller('AuthCtrl', function ($scope, $rootScope, $routeParams, $location, $window, $firebase, CFG, I18N, gettext, gettextCatalog, User) {

  var ref = new Firebase(CFG.FIREBASE_URL);
  var auth = $firebase(ref);

  $scope.init = function () {
    $scope.params = $routeParams;
    $scope.debug = CFG.DEBUG;
    $scope.lastBuildDate = lastBuildDate;
    $scope.error = null;
    $scope.info = null;

    User.all.$bindTo($scope, 'users').then(function () {
      //console.info('$scope.users bound:', $scope.users);
      // watch authentication events
      ref.onAuth(function(authData) {
        $scope.auth(authData);
      });
    });
    User.allByName.$bindTo($scope, 'usersByName').then(function () {
      //console.info('$scope.usersByName bound:', $scope.usersByName);
    });

    // watch rootScope online status variable
    $scope.$watch(function() {
      return $rootScope.online;
    }, function() {
      $scope.online = $rootScope.online;
      //console.log('changed online status to ' + $scope.online);
    }, true);
  
    // watch rootScope appcache status variable, if appcache is on in app config
    if (CFG.APPCACHE) {
      $scope.$watch(function() {
        return $rootScope.appcache;
      }, function() {
        $scope.appcache = $rootScope.appcache;
        //console.log('changed appcache status to ' + $scope.appcache.status);
      }, true);
    }

  };

  $scope.auth = function (authData) { // handle authentication events
    if (authData) {
      //console.info('Authentication success:', authData);
      ///var user = $scope.users[authData.uid];
      var user = User.find(authData.uid);

      if (user) {
        User.undelete(user); // restore user if it was deleted - TODO: recheck user deletion/undeletion
        User.setCurrentUser(user);
        if ($location.path() === '/login' || $location.path() === '/register') {
          $location.path('/');
          $scope.$apply();
        }
      } else { /* TODO: test this code!!! */
        // user not found: create social login user...
console.info(' *********** user not found: create social login user... ******* ');
        User.create(authData).then(
          function () { // success
            var user = User.find(authData.uid);
            User.setCurrentUser(user);
          },
          function (error) { // error
            toastr.error(gettext('Couldn\'t create user') + ' ' + authData.username);
            console.error(gettext('Couldn\'t create user') + ' ' + authData + ':', error);
         }
        );
      } /* ******************************* */
    } else {
      User.resetCurrentUser();
      console.info('Un-authentication (logout) success');
    }
  };

  $scope.register = function (valid) {
    console.info('controller - register');
    $scope.$broadcast('autofillFix:update');
    $scope.formRegisterSubmitted = true; // allow validation errors to be shown
    if (!valid) { // should not happen
      console.error('not valid', valid);
      $scope.error = gettext('Module is not valid');
      return false;
    }
    console.info('controller - register - valid', $scope.user);
    if ($scope.user) {
      ref.createUser({
        email: $scope.user.email,
        password: $scope.user.password
      }, function(err) {
        $scope.$apply(function () {
          if (err) {
            switch (err.code) {
              case 'EMAIL_TAKEN':
                // the email is already in use
                $scope.error = gettext('Email already in use');
                break;
              case 'INVALID_EMAIL':
                // the specified email is not a valid email
                $scope.error = gettext('Email is not valid');
                break;
              default:
                // unforeseen error
                $scope.error = gettext('Unforeseen error creating new user account');
                break;
            }
          } else {
            User.create($scope.user/*, $scope.user.password*/).then(
              function () { // success
                $location.path('/');
              },
              function (error) { // error
                $scope.error = gettext('Couldn\'t create user') + ' ' + $scope.user.username + ' (' + error + ')';
              }
            );
            //Auth.register($scope.user).then(function (auth) {
            //auth.user.username = $scope.user.username;
          }
        });
      });
    } else {
      $scope.error = 'No user data'; // TODO: ...
    }
  };

  $scope.login = function () {
    console.log('CONTROLLER scope.login()');
    $scope.$broadcast('autofillFix:update');
    if ($scope.user && $scope.user.usernameOrEmail && $scope.user.password) {    
      if ($scope.user.usernameOrEmail.indexOf('@') !== -1) { // user email looks like an email
        $scope.user.email = $scope.user.usernameOrEmail; // set user email with user inserted value
      } else { // user value doesn't look like an email
        // try matching user value against user names
        var existingUsername = $scope.usersByName[$scope.user.usernameOrEmail.toLowerCase()];
        var existingUser = $scope.users[existingUsername];
        if (existingUser && existingUser.email) { // user email is found as a user name
          $scope.user.email = existingUser.email; // set user email with found user email field
        } else { // check if user exists but is deleted
          var existingDeletedUser = User.findByUsername('_' + $scope.user.usernameOrEmail); //users.$child(user.usernameOrEmail);
          if (existingDeletedUser && existingDeletedUser.email) { // user email is found as a user name
           $scope.user.email = existingDeletedUser.email; // set user email with found user email field
          } else {
            $scope.error = gettext('Username does not exist');
            return;
          }
        }
      }
      ref.authWithPassword({
        email: $scope.user.email,
        password: $scope.user.password,
      }, function(err) {
        if (err) {
          console.error('Error during authentication:', err);
          $scope.error = err.message + ' ' + gettext('Please try again') + '.';
        }
      });
    } else {
      if (!$scope.user) {
        $scope.error = gettext('Please specify a username/email and password');
      } else {
        if (!$scope.user.usernameOrEmail) {
          $scope.error = gettext('Please specify a username/email');
        } else {
          if (!$scope.user.password) {
            $scope.error = gettext('Please specify a password');
          }
        }
      }
    }
  };

  $scope.loginSocial = function (provider) {
    console.warn('CONTROLLER loginSocial()');
    var mode = 'redirect';
    if (provider) {
      switch (mode) {
        case 'popup':
          ref.authWithOAuthPopup(provider, function(err) {
            if (err) {
              console.error('Error during social authentication:', err);
              $scope.error = err.message + ' ' + gettext('Please try again') + '.';
            }
          }, {
            remember: true,
            //remember: 'sessionOnly',
            scope:
              (provider === 'google') ? 'https://www.googleapis.com/auth/userinfo.profile' : 
              (provider === 'facebook') ? 'email' :
              null, // a comma-delimited list of requested extended permissions
          });
          break;
        case 'redirect':
          ref.authWithOAuthRedirect(provider, function(err) {
            if (err) {
              console.error('Error during social authentication:', err);
              $scope.error = err.message + ' ' + gettext('Please try again') + '.';
            }
          }, {
            remember: true,
            //remember: 'sessionOnly',
            scope:
              (provider === 'google') ? 'https://www.googleapis.com/auth/userinfo.profile' : 
              (provider === 'facebook') ? 'email' :
              null, // a comma-delimited list of requested extended permissions
          });
          break;
        default: // should not happen
          console.error('Unforeseen social login mode: ', mode);
          break;
      }
    } else { // should not happen
      $scope.error = gettext('Please specify an authentication provider');
    }
  };

  $scope.logout = function () {
    console.info('CONTROLLER logout()');
    User.resetCurrentUser();
    //Auth.logout();
    ref.unauth();
    $rootScope.formLabel = '';
    $location.path('/');
  };

  $scope.sendPasswordResetEmail = function (email) {
    $scope.reset();
    //Auth.sendPasswordResetEmail(email).then(function(error) {
    auth.$sendPasswordResetEmail(email).then(function(error) {
      if (typeof error === null) {
        toastr.info(gettext('Password sent'));
        $scope.info =
          gettext(
            'An email with a temporary password has been sent to your email: ' +
            'use it to login and then change it.'
          )
        ;
      } else {
        if (error.code === 'INVALID_EMAIL') {
          $scope.error = gettext('Please specify a valid email');
        } else {
          if (error.code === 'INVALID_USER') {
            $scope.error = gettext('Sorry, this is not a registered email');
          } else {
            $scope.error = gettext('Sorry, could not send password email') +
            ' (' + error.message + '). ' +
            gettext('Please retry later') +
            '.';
          }
        }
      }
    });
  };

  $scope.appcacheStatus = function () {
    //console.info('appcacheStatus()');
    var msg;
    switch ($rootScope.appcache.status) {
      case 'initializing':
        msg = gettext('Cache is being initialized');
        break;
      case 'error':
        if ($scope.online) {
          msg = gettext('Cache is not updated (probably the manifest is unreachable)');
        } else {
          msg = gettext('Cache is not updated because you are offline');
        }
        break;
      case 'cached':
        msg = gettext('Cache is up-to-date');
        break;
      case 'checking':
        msg = gettext('Checking for the presence of an update');
        break;
      case 'downloading':
        msg = gettext('Preparing the downloading an update');
        break;
      case 'noupdate':
        msg = gettext('No update is present');
        break;
      case 'obsolete':
        msg = gettext('Cache is obsolete');
        break;
      case 'progress':
        msg = gettext('Downloading an update');
        break;
      case 'updateready':
        msg = gettext('An update is ready');
        $window.applicationCache.swapCache();
        $window.location.reload();
        $rootScope.appcache.status = 'initializing';
        break;
      default: // shouldn't happen
        msg = gettext('Cache is in unknown state') + ' "' + $rootScope.appcache.status + '"';
        break;
    }
    toastr.info(gettextCatalog.getString(msg));
  };

  $scope.reset = function() {
    console.log('scope.reset()');
    $scope.error = null;
    $scope.info = null;
  };

});