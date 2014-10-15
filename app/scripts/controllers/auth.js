'use strict';
 
app.controller('AuthCtrl', function ($scope, $rootScope, $routeParams,       $firebase,      $location, $window, CFG, I18N, gettext, gettextCatalog, Auth, User) {
  //$rootScope.formLabel = '';

/* Commenting this check to allow registering new users for signed-in users...
   Should allow only administrators?
*/
/*   
  if (Auth.signedIn()) {
    $location.path('/');
  }
*/
  var refAuth = new Firebase(CFG.FIREBASE_URL);
  //var auth = $firebase(refAuth);

  $scope.params = $routeParams;
  $scope.debug = CFG.DEBUG;
  $scope.lastBuildDate = lastBuildDate;

  // watch rootScope online status variable
  $scope.$watch(function() {
    return $rootScope.online;
  }, function() {
    $scope.online = $rootScope.online;
    //console.log('changed online status to ' + $scope.online);
  }, true);

  if (CFG.APPCACHE) {
    // watch rootScope appcache status variable
    $scope.$watch(function() {
      return $rootScope.appcache;
    }, function() {
      $scope.appcache = $rootScope.appcache;
      //console.log('changed appcache status to ' + $scope.appcache.status);
    }, true);
    
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
  }

  $scope.init = function () {
    $scope.selectedLanguage = $scope.getCurrentLanguage();
    $scope.supportedLanguages = $scope.getSupportedLanguages();
    $scope.supportedLanguagesSorted = $scope.getSupportedLanguagesSorted();
    $scope.selectingLanguageFlag = false;
    $scope.error = null;
    $scope.info = null;
  };

  $scope.reset = function() {
    $scope.error = null;
    $scope.info = null;
  };

  $scope.register = function (valid) {
    console.info('controller - register');
    $scope.$broadcast('autofillFix:update');
    $scope.formRegisterSubmitted = true; // allow validation errors to be shown
    if (!valid) {
      console.error('not valid', valid);
      return;
    }
    console.info('controller - register - valid', $scope.user);
    if ($scope.user) {
      Auth.register($scope.user).then(function (auth) {
        console.info('registered user:', auth.user);
        auth.user.username = $scope.user.username;
        User.create(auth.user, $scope.user.password).then(
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
        if (error.message === 'FirebaseSimpleLogin: The specified email address is already in use.') {
          // email is already present in Firebase: check it's not a deleted account...
          // deleted users are kept in findByUsername table with a '_' sign before the name
          var user = User.findByUsername('_' + $scope.user.username);
          console.log('looked up user:', user);
          if (user.email.toLowerCase() === $scope.user.email.toLowerCase()) {
            // username and email overlap
            if (user.deleted) {// it is a deleted account
              toastr.error('This account was deleted. Just log-in and it will be restored...');
              console.info('deleted account');
              // restore account
            }
          }
        } else {
          $scope.error = 'Sorry, could not register user (' + error.message + ')';
          console.error('Register error:', error.message);
        }
      });
    } else {
      $scope.error = 'Please specify user\'s data';
    }
  };

  $scope.login = function () {
    console.log('scope.login()');
    $scope.$broadcast('autofillFix:update');
    if ($scope.user && $scope.user.usernameOrEmail && $scope.user.password) {    
      if ($scope.user.usernameOrEmail.indexOf('@') !== -1) { // user email looks like an email
        //console.log('user inserted value looks like an email');
        $scope.user.email = $scope.user.usernameOrEmail; // set user email with user inserted value
      } else { // user value doesn't look like an email
        // try matching user value against user names
        //console.log('user inserted value looks like an username');
        var existingUser = User.findByUsername($scope.user.usernameOrEmail); //users.$child(user.usernameOrEmail);
        //console.warn('login() - existingUser:', existingUser);
        if (existingUser && existingUser.email) { // user email is found as a user name
          $scope.user.email = existingUser.email; // set user email with found user email field
        } else { // check if user exists but is deleted
          var existingDeletedUser = User.findByUsername('_' + $scope.user.usernameOrEmail); //users.$child(user.usernameOrEmail);
          if (existingDeletedUser && existingDeletedUser.email) { // user email is found as a user name
           $scope.user.email = existingDeletedUser.email; // set user email with found user email field
          } else {
            $scope.error = 'Username not existing';
            return;
          }
        }
      }
      refAuth.authWithPassword({
        email: $scope.user.email,
        password: $scope.user.password,
      }, function(err, authData) {
        if (err) {
          console.error('Error during authentication:', err);
          $scope.error = err.message + ' ' + 'Please try again' + '.';
        } else {
          console.info('Authentication success:', authData);
          var user = User.find(authData.uid);
          User.setCurrentUser(user);
            // TODO: rethink user deletion/undeletion
            //User.undelete(user); // restore user if it was deleted
          $location.path('/');
          $scope.$apply(); // TODO: why picchè we need to apply scope?
        }
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
    console.log('provider:', provider);
    if (provider) {
      var x = refAuth.authWithOAuthRedirect(provider, function(err, authData) {
        if (err) {
          console.error('Error during social authentication:', err);
          $scope.error = err.message + ' ' + 'Please try again' + '.';
        } else {
          console.info('Social authentication success:', authData);
          var user = User.find(authData.uid);
          User.setCurrentUser(user);
            // TODO: rethink user deletion/undeletion
            //User.undelete(user); // restore user if it was deleted
          //$location.path('/');
          //$scope.$apply(); // TODO: why picchè we need to apply scope?
        }
      }, {
remember: true,
scope: 'https://www.googleapis.com/auth/userinfo.profile'
//remember: 'sessionOnly',
//scope: 'https://www.googleapis.com/auth/plus.login'
      }
    );
  console.log('x:', x);
/*
    Auth.loginSocial(provider).then(function (authUser) {
      //console.warn('Auth.loginSocial(provider).then() RETURNED - authUser:', authUser);
      User.create(authUser).then(
        function () {
          // success
          //var user = User.findByUid(authUser.uid);
          var user = User.find(authUser.uid);
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
    });


      auth.$login(provider, { // provider must be supported, otherwise we get a runtime error
        rememberMe: true,
        scope:
          (provider === 'google') ? 'https://www.googleapis.com/auth/userinfo.profile' : 
          (provider === 'facebook') ? 'email' :
          null, // a comma-delimited list of requested extended permissions
          // google: 'https://www.googleapis.com/auth/plus.login' (see https://developers.google.com/+/api/oauth)
          // facebook: 'user_friends,email' (see https://developers.facebook.com/docs/reference/login/#permissions)
          // twitter: 'user_friends,email' (see https://developers.facebook.com/docs/reference/login/#permissions)
        / * jshint camelcase: false * /
        oauth_token: (provider === 'twitter') ? 'true' : null, // skip the OAuth popup-dialog and create a user session directly using an existing twitter session
        preferRedirect: true // true redirects to google, instead of using a popup
      });
*/
    } else { // should not happen
      $scope.error = 'Please specify an authentication provider';
    }
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

/*
  $scope.getSupportedLanguages = function () {
    return I18N.getSupportedLanguages();
  };
  $scope.getSupportedLanguagesSorted = function () {
    var languages = I18N.getSupportedLanguages();
    var sortable = [];
    for (var language in languages) {
      sortable.push({key: language, des: languages[language]});
    }
    sortable.sort(function(a, b) { return a.des > b.des; });
    return sortable;
  };
  $scope.getCurrentLanguage = function () {
    return I18N.getCurrentLanguage();
  };
  $scope.getCurrentLanguageName = function () {
    return I18N.getCurrentLanguageName();
  };
  $scope.getCurrentLanguageFlag = function () {
    return I18N.getCurrentLanguageFlag();
  };
  $scope.getCurrentLanguageScript = function () {
    return I18N.getCurrentLanguageScript();
  };
  $scope.setCurrentLanguage = function (language) {
    return I18N.setCurrentLanguage(language);
  };
  $scope.selectingLanguage = function () {
    $scope.selectingLanguageFlag = true;
  };
  $scope.languageSelected = function () {
    //console.info(' *** selectedLanguage():', $scope.selectedLanguage);
    $scope.selectingLanguageFlag = false;
    return I18N.setCurrentLanguage($scope.selectedLanguage);
  };
*/
  $scope.reset();
});