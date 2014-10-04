'use strict';
 
app.factory('Auth', function ($rootScope, $firebase, $firebaseSimpleLogin, $q, CFG, User) {
  var ref = new Firebase(CFG.FIREBASE_URL);
  var auth = $firebaseSimpleLogin(ref);
  //var refUsers = new Firebase(CFG.FIREBASE_URL + 'users');
  //var users = $firebase(refUsers);
  //var refUsersByName = new Firebase(CFG.FIREBASE_URL + 'usersByName');
  //var usersByName = $firebase(refUsersByName);

  var Auth = {
    register: function (user) {
      //console.info('REGISTER:', user);
      return auth.$createUser(user.email, user.password);
    },
    signedIn: function () {
      if (auth.user !== null && $rootScope.currentUser) {
        return true;
      }
      //return false;
    },
    hasRole: function (roles) {
      //console.info('hasRole()', roles);
      if ((auth.user !== null) && $rootScope.currentUser && $rootScope.currentUser.roles) {
        /* jslint bitwise: true */
        if ((roles & CFG.ROLES.ADMIN) && $rootScope.currentUser.roles.admin) {
          //console.info('hasRole(admin) true');
          return true;
        }
        /* jslint bitwise: true */
        if ((roles & CFG.ROLES.EDIT_CUSTOMERS) && $rootScope.currentUser.roles.editCustomers) {
          //console.info('hasRole(edit_customers) true');
          return true;
        }
      }
      return false;
    },
    currentUser: function () {
      if (auth.user !== null) {
        return $rootScope.currentUser;
      }
      //return null;
    },
    login: function (user) {
      // TODO: move this in controller //////////////////////
      /* decide if user did pass a username or an email */
      if (user.usernameOrEmail && user.usernameOrEmail.indexOf('@') !== -1) { // user email looks like an email
        //console.log('user inserted value looks like an email');
        user.email = user.usernameOrEmail; // set user email with user inserted value
      } else { // user value doesn't look like an email
        // try matching user value against user names
        //console.log('user inserted value looks like an username');
        var existingUser = User.findByUsername(user.usernameOrEmail); //users.$child(user.usernameOrEmail);
        if (existingUser && existingUser.email) { // user email is found as a user name
          user.email = existingUser.email; // set user email with found user email field
        } else { // this happens sometimes for 'administrator': why? only temporary network outages?
          //user.email = null; // no user.email set, auth.$login will fail...
          console.warn('return defer error, existingUser undefined or without email:', existingUser);
          // return deferred null
          var deferred = $q.defer();
          deferred.resolve(null);
          return deferred.promise;
        }
      }
      //////////////////////////////////////////////////////
      return auth.$login('password', {
        email: user.email,
        password: user.password,
        rememberMe: true,
        debug: CFG.DEBUG
      });
    },
    loginSocial: function (provider) {
      return auth.$login(provider, { // TODO: test usage with wrong provider...
        rememberMe: true,
        scope:
          (provider === 'google') ? 'https://www.googleapis.com/auth/userinfo.profile' : 
          (provider === 'facebook') ? 'email' :
          null, // a comma-delimited list of requested extended permissions
          // google: 'https://www.googleapis.com/auth/plus.login' (see https://developers.google.com/+/api/oauth)
          // facebook: 'user_friends,email' (see https://developers.facebook.com/docs/reference/login/#permissions)
          // twitter: 'user_friends,email' (see https://developers.facebook.com/docs/reference/login/#permissions)
        /* jshint camelcase: false */
        oauth_token: (provider === 'twitter') ? 'true' : null, // skip the OAuth popup-dialog and create a user session directly using an existing twitter session
        preferRedirect: false // true redirects to google (doesn't work properly...), instead of using a popup
      });
    },
    logout: function () {
      auth.$logout();
    },
    delete: function (user) { // TODO: test this
      return auth.$removeUser(user.email, user.password, function(error) { // password is password_hash ?
        if (error === null) {
          console.info('User removed successfully');
        } else {
          toastr.log('Error removing user: ' + error.message);
          console.error('Error removing user:', error);
        }
        return error;
      });
    },
    sendPasswordResetEmail: function (email) { // TODO: test this
      //console.info('auth:', auth, email);
      return auth.$sendPasswordResetEmail(email).then(
        null,
        function (error) {
          return error;
        }
      );
    }
  };

  $rootScope.signedIn = function () {
    return Auth.signedIn();
  };
 
  $rootScope.hasRole = function (role) {
    return Auth.hasRole(role);
  };

  return Auth;
});