'use strict';
 
app.factory('Auth', function ($rootScope, $firebase, CFG) {
  // TODO: uninstall firebasesimplelogin ...!!!
  var refAuth = new Firebase(CFG.FIREBASE_URL);
  var auth = $firebase(refAuth);

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
    currentUser: function () {
      if (auth.user !== null) {
        return $rootScope.currentUser;
      }
    },
  };

  $rootScope.signedIn = function () {
    return Auth.signedIn();
  };
 
/*
  $rootScope.hasRole = function (role) {
    return Auth.hasRole(role);
  };
*/

  return Auth;
});

/*
    hasRole: function (roles) {
      //console.info('hasRole()', roles);
      if ((auth.user !== null) && $rootScope.currentUser && $rootScope.currentUser.roles) {
        / * jslint bitwise: true * /
        if ((roles & CFG.ROLES.ADMIN) && $rootScope.currentUser.roles.admin) {
        / * jslint bitwise: false * /
          //console.info('hasRole(admin) true');
          return true;
        }
        / * jslint bitwise: true * /
        if ((roles & CFG.ROLES.EDIT_CUSTOMERS) && $rootScope.currentUser.roles.editCustomers) {
        / * jslint bitwise: false * /
          //console.info('hasRole(edit_customers) true');
          return true;
        }
      }
      return false;
    },
*/
/*
    login: function (user) {
      console.warn('SERVICE login(user):', user);
      // decide if user did pass a username or an email
      if (user.usernameOrEmail && user.usernameOrEmail.indexOf('@') !== -1) { // user email looks like an email
        //console.log('user inserted value looks like an email');
        user.email = user.usernameOrEmail; // set user email with user inserted value
      } else { // user value doesn't look like an email
        // try matching user value against user names
        //console.log('user inserted value looks like an username');
        var existingUser = User.findByUsername(user.usernameOrEmail); //users.$child(user.usernameOrEmail);
      console.warn('login() - existingUser:', existingUser);
        if (existingUser && existingUser.email) { // user email is found as a user name
          user.email = existingUser.email; // set user email with found user email field
        } else { // check if user exists but is deleted
          var existingDeletedUser = User.findByUsername('_' + user.usernameOrEmail); //users.$child(user.usernameOrEmail);
          if (existingDeletedUser && existingDeletedUser.email) { // user email is found as a user name
           user.email = existingDeletedUser.email; // set user email with found user email field
          } else {
          }
        }
      }
      refAuth.authWithPassword({
        email: 'sistemisolarirossi@gmail.com', //user.email,
        password: '+piluxtutti' //user.password,
      }, function(err, authData) {
        if (err) {
          console.error('Error during authentication:', err);
          //$scope.error = 'Please specify an existing username/email';
        } else {
          console.info('Authentication success:', authData);
          var user = User.find(authData.uid);
          console.info('user:', user);
          User.setCurrentUser(user);
          //User.undelete(user); // restore user if it was deleted
          $location.path('/');
          $location.path('/');
          console.info('location-path');
        }
      });
    },
    loginSocial: function (provider) {
      console.warn('SERVICE loginSocial()');
      return auth.$login(provider, { // provider must be supported, otherwise we get a runtime error
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
    },
    logout: function () {
      console.log('SERVICE logout()');
      refAuth.unauth();
    },
*/
/*
    delete: function (user) { // TODO: rethink use-case for this method: we must know user.password...
      return auth.$removeUser(user.email, user.password, function(error) {
        if (error === null) {
          console.info('User removed successfully');
        } else {
          toastr.log('Error removing user: ' + error.message);
          console.error('Error removing user:', error);
        }
        return error;
      });
    },
*/
/*
    sendPasswordResetEmail: function (email) {
      return auth.$sendPasswordResetEmail(email).then(
        null,
        function (error) {
          return error;
        }
      );
    }
*/

/*
  refAuth.onAuth(function(authData) {
    if (authData) {
      // user authenticated with Firebase
      console.log(' *** onAuth(): User ID: ' + authData.uid + ', Provider: ' + authData.provider);
      $location.path('/');
    } else {
      console.log(' *** onAuth(): LOGOUT');
    }
  });
*/